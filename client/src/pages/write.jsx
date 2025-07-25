import React, { useCallback, useEffect, useRef, useState } from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import SUNEDITOR_LANG from 'suneditor/src/lang/ko'; // Korean language pack
import useWrite from "../service/posts/useWrite";
//import useModalStore from "../store/useModalStore";

export default function Write() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");
  const [is_private, setIsPrivate] = useState(false);
  //const [user_id, setUserId] = useState(0);
  //const { closeModal } = useModalStore();
  useEffect(() => {
    setSlug(`/${title}`);
    setIsPrivate(false);
    //setUserId(1);
  }, [title]); // Added title dependency

  const testResultRef = useRef(null);
  const sanitisedResultRef = useRef(null);

  const joinMutation = useWrite({
    onSuccess: (response) => {
      if(response.response.status === 201) {
        alert("글쓰기 완료");
        //closeModal("write");
      }
    },
    onError: (error) => {
      console.log("글쓰기 서버 오류", error);
    }
  });

  const writing = async (e) => {
    e.preventDefault();
    joinMutation.mutate({ title, content, slug, is_private  });
  };

  const sanitise = useCallback((node) => {
    const allowedTags = ['div', 'blockquote', 'p', 'h2', 'span', 'b', 'i', 'u', 'strong',
      'em', 'ul', 'ol', 'li', 'a', 'img', 'br', 'hr', 'section', 'tr', 'td', 'th', 'tbody', 'table', 'figure'];
    const allowedAttributes = ['href', 'src', 'id', 'className', 'style', 'class'];

    function isSafeUrl(value) {
      if (!value) return false;
      const trimmed = value.trim().toLowerCase();
      return (
        trimmed.startsWith('http://') ||
        trimmed.startsWith('https://') ||
        trimmed.startsWith('mailto:') ||
        trimmed.startsWith('tel:') ||
        trimmed.startsWith('www.') ||
        trimmed.startsWith('data:image/') ||
        trimmed.startsWith('/')
      );
    }

    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent.replace(/\n/g, '');
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const tag = node.tagName.toLowerCase();
      if (!allowedTags.includes(tag)) return '';

      const safeAttributes = [...node.attributes]
        .filter(attr => {
          const name = attr.name.toLowerCase();
          const value = attr.value;
          if (!allowedAttributes.includes(name)) return false;
          if ((name === 'href' || name === 'src') && !isSafeUrl(value)) return false;
          return true;
        })
        .map(attr => {
          const cleanValue = attr.value.replace(/\n/g, '');
          return `${attr.name}="${cleanValue}"`;
        })
        .join(' ');

      const openingTag = safeAttributes ? `<${tag} ${safeAttributes}>` : `<${tag}>`;
      const closingTag = `</${tag}>`;

      const childrenHtml = [...node.childNodes].map(child => sanitise(child)).join('');
      return `${openingTag}${childrenHtml}${closingTag}`;
    }

    return '';
  }, []);

  const handleChange = (rawHTML) => {
    console.log("Editor content changed:", rawHTML);
    const parser = new DOMParser();
    
    const doc = parser.parseFromString(`<div>${rawHTML}</div>`, 'text/html');
    const node = doc.body.firstChild;
    
    if (node) {
        const sanitized = sanitise(node);
        console.log(sanitized);
        setContent(sanitized);

        // For debugging view
        if (testResultRef.current) {
            testResultRef.current.textContent = rawHTML;
        }
        if (sanitisedResultRef.current) {
            sanitisedResultRef.current.textContent = sanitized;
        }
    } else {
        setContent("");
         if (testResultRef.current) {
            testResultRef.current.textContent = rawHTML;
        }
        if (sanitisedResultRef.current) {
            sanitisedResultRef.current.textContent = "";
        }
    }
  };

  return (
    <div className="write-container">
      <div className="write-editor">
        <form className="write-form" onSubmit={writing}>
          <div>
            <input id='write_title' type='text' name='title' placeholder='제목을 입력하세요' onChange={(e) => setTitle(e.target.value)}></input>
            <input id='write_tag' type='text' name='tag' placeholder='태그를 입력하세요'></input>
            <input type="hidden" name="slug" value={slug} />
            <input type="hidden" name="is_private" value={is_private} />
          </div>
          
          <div className='editor-container' style={{ marginBottom: '1em' }}>
            <SunEditor
                lang={SUNEDITOR_LANG}
                width="100%"
                height="auto"
                minHeight="300px"
                onChange={handleChange}
                setOptions={{
                    buttonList: [
                        [
                            'undo', 'redo', 'fontSize',
                            'paragraphStyle', 'blockquote',
                            'bold', 'underline', 'italic', 'strike', 'subscript', 'superscript',
                            'fontColor', 'hiliteColor',
                            'outdent', 'indent',
                            'align', 'horizontalRule', 'list', 'lineHeight',
                            'table', 'link', 'image', 'video', 'codeView',
                        ]
                    ],
                    imageFileInput: true,
                }}
                defaultValue="<p>Hi</p>"
            />
          </div>

          {/* The save button is removed as onChange handles updates */}
          {/* <div className="temp">
            <button onClick={save}>저장저장</button>
          </div> */}

          <div className="temp" style={{ marginTop: '1em' }}>
            <div className="box">
              <h3>찐 HTML</h3>
              <pre ref={testResultRef}></pre>
            </div>
            <div className="box">
              <h3>위험요소 제거된 HTML</h3>
              <pre ref={sanitisedResultRef}></pre>
            </div>
          </div>
          <div className='button-container'>
            <div className='left'>
              <button className='go-back-button'>&lt;- 나가기</button>
            </div>
            
            <div className='right'>
              <button className='save-tmp-button'>임시저장</button>
              <button type="submit" className="write-btn">출간하기</button>
            </div>
          </div>
        </form>
      </div>

      <div className='write-preview'>
        <p>미리보기 프리뷰</p>
      </div>

    </div>
  );
}