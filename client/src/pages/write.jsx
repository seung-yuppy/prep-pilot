import React, { useCallback, useEffect, useRef, useState } from 'react';
import SUNEDITOR from 'suneditor';
import 'suneditor/dist/css/suneditor.min.css';
import SUNEDITOR_LANG from 'suneditor/src/lang/ko'; // Korean language pack
import useWrite from "../service/posts/useWrite";
//import useModalStore from "../store/useModalStore";

export default function Write() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");
  const [is_private, setIsPrivate] = useState(false);
  const [user_id, setUserId] = useState(0);
  //const { closeModal } = useModalStore();
  useEffect(() => {
    setSlug(`/${title}`);
    setIsPrivate(false);
    setUserId(1);
  }, []);



  const editorRef = useRef(null);
  const testResultRef = useRef(null);
  const sanitisedResultRef = useRef(null);
  const [editorInstance, setEditorInstance] = useState(null);
  const hasEditorInitialized = useRef(false);

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
    joinMutation.mutate({ title, content, slug, is_private, user_id  });
  };

  const sanitise = useCallback((node) => {
    const allowedTags = ['div', 'blockquote', 'p', 'h2', 'span', 'b', 'i', 'u', 'strong',
      'em', 'ul', 'ol', 'li', 'a', 'img', 'br', 'hr', 'section', 'tr', 'td', 'th', 'tbody', 'table'];
    const allowedAttributes = ['href', 'src', 'id', 'className', 'style'];

    function isSafeUrl(value) {
      if (!value) return false;
      const trimmed = value.trim().toLowerCase();
      return (
        trimmed.startsWith('http://') ||
        trimmed.startsWith('https://') ||
        trimmed.startsWith('mailto:') ||
        trimmed.startsWith('tel:') ||
        trimmed.startsWith('www.') ||
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

  const save = useCallback(() => {
    if (editorInstance) {
      const rawHTML = editorInstance.getContents();
      if (testResultRef.current) {
        testResultRef.current.textContent = rawHTML;
      }

      const parser = new DOMParser();
      const doc = parser.parseFromString(`<div>${rawHTML}</div>`, 'text/html');
      const node = doc.body.firstChild;
      const cleaned = sanitise(node);
      if (sanitisedResultRef.current) {
        sanitisedResultRef.current.textContent = cleaned;
      }
    }
  }, [editorInstance, sanitise]);

  useEffect(() => {
    if (editorRef.current && !hasEditorInitialized.current) {
      const editor = SUNEDITOR.create(editorRef.current, {
        onChange: (content) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(`<div>${content}</div>`, 'text/html');
          const node = doc.body.firstChild;
          setContent(sanitise(node));
        },
        lang: SUNEDITOR_LANG,
        width: '100%',
        height: '100%',
        buttonList: [
          [
            'undo', 'redo', 'fontSize',
            'paragraphStyle', 'blockquote',
            'bold', 'underline', 'italic', 'strike', 'subscript', 'superscript',
            'fontColor', 'hiliteColor',
            'outdent', 'indent',
            'align', 'horizontalRule', 'list', 'lineHeight',
            'table', 'link', 'image', 'video', 'codeView', 'save',
          ]
        ],
        imageFileInput: true,
      });
      setEditorInstance(editor);
      hasEditorInitialized.current = true;
    }

    return () => {
      if (editorInstance) {
        editorInstance.destroy();
      }
    };
  }, [editorInstance]);

  return (
    <div className="write-container">
      <div className="write-editor">
        <form className="write-form" onSubmit={writing}>
          <div>
            <input id='write_title' type='text' name='title' placeholder='제목을 입력하세요' onChange={(e) => setTitle(e.target.value)}></input>
            <input id='write_tag' type='text' name='tag' placeholder='태그를 입력하세요'></input>
            <input type="hidden" name="slug" value={slug} />
            <input type="hidden" name="is_private" value={is_private} />
            <input type="hidden" name="user_id" value={user_id} />
          </div>
          
          <div className='editor-container' style={{ marginBottom: '1em' }}>
            <textarea ref={editorRef} style={{ width: 'auto' }}>Hi</textarea>
          </div>

          <div className="temp">
            <button onClick={save}>저장저장</button>
          </div>

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