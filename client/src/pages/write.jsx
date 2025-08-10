import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import SUNEDITOR_LANG from 'suneditor/src/lang/ko'; // Korean language pack
import useImageUpload from '../service/posts/useImageUpload';
import useWrite from "../service/posts/useWrite";
import { doParse } from "../util/posts/write";
//import useModalStore from "../store/useModalStore";

import Popup from '../components/Popup';

export default function Write() {
  const [isTempSavedVisible, setIsTempSavedVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");
  const [is_private, setIsPrivate] = useState(false);
  const navigate = useNavigate();
  //const [user_id, setUserId] = useState(0);
  //const { closeModal } = useModalStore();
  const sanitizedForTemp = useRef("");
  useEffect(() => {
    setSlug(`/${title}`);
    setIsPrivate(false);
    //setUserId(1);
  }, [title]); // Added title dependency

  const testResultRef = useRef(null);
  const sanitisedResultRef = useRef(null);

  const writeMutation = useWrite({
    onSuccess: (response) => {
      if(response.response.status === 201 || response.response.status === 200) {
        //alert("글쓰기 완료");
        navigate('/');
      }
    },
    onError: (error) => {
      console.log("글쓰기 서버 오류", error);
    }
  });

  const imageUploadMutation = useImageUpload({
    onSuccess: (response, data) => {
      if(response.response.status === 201) {
        alert(data);
        //closeModal("write");
      }
    },
    onError: (error) => {
      console.log("글쓰기 서버 오류", error);
    }
  });


  const writing = async (e) => {
    e.preventDefault();

    const parser = new DOMParser();
    const doc = parser.parseFromString(sanitizedForTemp.current, 'text/html');
    const images = Array.from(doc.querySelectorAll('img[src^="data:image"]'));

    if (images.length > 0) {
      const uploadPromises = images.map(async (img) => {
        const base64Data = img.src;
        const response = await fetch(base64Data);
        const blob = await response.blob();
        const file = new File([blob], "image.png", { type: blob.type });

        return imageUploadMutation.mutateAsync(file);
      });

      try {
        const results = await Promise.all(uploadPromises);
        results.forEach((data, index) => {
          if (data.response.ok) {
            images[index].src = data.data.url;
          } else {
            console.error('Image upload failed');
          }
        });
      } catch (error) {
        console.error('Image upload error:', error);
        return; // Stop execution if any upload fails
      }
    }

    const updatedHtml = doc.body.innerHTML;
    const forDBSanitized = doParse(new DOMParser().parseFromString(updatedHtml, 'text/html').body);
    const finalContent = JSON.stringify(forDBSanitized);

    writeMutation.mutate({ title, content: finalContent, slug, is_private });
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
    //console.log("Editor content changed:", rawHTML);
    const parser = new DOMParser();
    
    const doc = parser.parseFromString(`<div>${rawHTML}</div>`, 'text/html');
    const node = doc.body.firstChild;
    
    if (node) {
        const sanitized = sanitise(node);
        const forDBSanitized = doParse(new DOMParser().parseFromString(sanitized, 'text/html').body.firstChild);
        setContent(JSON.stringify(forDBSanitized));
        console.log(forDBSanitized);
        document.querySelector('#preview_content').innerHTML = sanitized;
        sanitizedForTemp.current = sanitized;
        
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

  const handleTitle = (value) => {
    document.querySelector('#preview_title').textContent = value;
  };

  const handleContentKeyUp = (rawHTML) => {
    const parser = new DOMParser();
    
    const doc = parser.parseFromString(`<div>${rawHTML}</div>`, 'text/html');
    const node = doc.body.firstChild;
    const sanitized = sanitise(node);
    document.querySelector('#preview_content').innerHTML = sanitized;
  };

  const handleImageUploadBefore = (files, info, uploadHandler) => {
    const file = files?.[0];
    if (!file) {
      uploadHandler({ errorMessage: "No file selected" });
      return;
    }
  
    // mutationFn should accept a File and do formData.append('upload', file, file.name)
    imageUploadMutation.mutate(file, {
      onSuccess: ({ data }) => {
        if (data?.uploaded && data?.url) {
          uploadHandler({
            result: [
              {
                url: data.url,       // S3 public URL from backend
                name: file.name,
                size: file.size,
              },
            ],
          });
        } else {
          uploadHandler({ errorMessage: "Image upload failed" });
        }
      },
      onError: (error) => {
        console.error("Image upload error:", error);
        uploadHandler({ errorMessage: "Image upload failed" });
      },
    });
  
    // Let SunEditor wait for uploadHandler to be called
    return undefined;
  };

  const tempSave = () => {
    localStorage.setItem('tmpWrite', sanitizedForTemp.current);
    setIsTempSavedVisible(true);
  }


  return (
    <div className="write-container">
      <div className="write-editor">
        <form className="write-form" onSubmit={writing}>
          <div>
            <input id='write_title' type='text' name='title' placeholder='제목을 입력하세요' onChange={(e) => setTitle(e.target.value)} onKeyUp={(e) => handleTitle(e.target.value)}></input>
            <input class='write-tag' type='text' name='tag' placeholder='태그를 입력하세요'></input>
            <input type="hidden" name="slug" value={slug} />
            <input type="hidden" name="is_private" value={is_private} />
          </div>
          
          <div className='editor-container' style={{ marginBottom: '1em' }}>
            <SunEditor
                onImageUploadBefore={handleImageUploadBefore}
                lang={SUNEDITOR_LANG}
                width="100%"
                height="auto"
                minHeight="300px"
                onKeyUp = {(e) => handleContentKeyUp(e.target.innerHTML)}
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
                placeholder='내용을 입력하세요'
                
            />
          </div>

          <Popup
            content="포스트가 임시저장되었습니다."
            color="#4CAF50"
            visible={isTempSavedVisible}
            onClose={() => setIsTempSavedVisible(false)}
          />
          <div className='button-container'>
            <div className='left'>
              <button type='button' className='go-back-button' onClick={() => navigate('/')}>&lt;- 나가기</button>
            </div>
            
            <div className='right'>
              <button type='button' className='save-tmp-button' onClick={tempSave}>임시저장</button>
              <button type="submit" className="write-btn">출간하기</button>
            </div>
          </div>
        </form>
      </div>

      <div className='write-preview'>
        <h1 id="preview_title"></h1>
        <div className='preview-content' id="preview_content"></div>
      </div>

    </div>
  );
}