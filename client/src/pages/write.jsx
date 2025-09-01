import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import SUNEDITOR_LANG from 'suneditor/src/lang/ko'; // Korean language pack
import useCorrectText from '../service/post/useCorrectText';
import useImageUpload from '../service/posts/useImageUpload';
import useWrite from "../service/posts/useWrite";
import usePostTag from '../service/tags/usePostTag';
import { doParse } from "../util/posts/write";
//import useModalStore from "../store/useModalStore";


import Popup from '../components/Popup';



export default function Write() {
  const [isAiReviewActive, setIsAiReviewActive] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupColor, setPopupColor] = useState("#4CAF50");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");
  const [initialContent, setInitialContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const navigate = useNavigate();
  const tmptmp = "";
  useEffect(() => {
    const savedData = localStorage.getItem('tmpWrite');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setTitle(parsedData.title);
        setTags(parsedData.tags || []);
        setInitialContent(parsedData.content);
        document.querySelector('#preview_title').textContent = parsedData.title;
      } catch (error) {
        // Handle old data format (raw HTML string)
        setInitialContent(savedData);
      }
    }
  }, []);

  // 페이지 이동 시 스크롤을 맨 위로 초기화
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  //const [user_id, setUserId] = useState(0);
  //const { closeModal } = useModalStore();
  const sanitizedForTemp = useRef("");

  useEffect(() => {
    if (initialContent && editorRef.current) {
      editorRef.current.setContents(initialContent);
      document.querySelector('#preview_content').innerHTML = initialContent;
      handleChange(initialContent);
    }
  }, [initialContent]);

  useEffect(() => {
    setSlug(`/${title}`);
    setIsPrivate(false);
    //setUserId(1);
  }, [title]); // Added title dependency

  const testResultRef = useRef(null);
  const sanitisedResultRef = useRef(null);
  const editorRef = useRef(null);

  const writeMutation = useWrite({
    onSuccess: (response) => {
      if(response.response.status === 201 || response.response.status === 200) {
        setPopupContent("글쓰기 성공!");
        setPopupColor("blue");
        setIsPopupVisible(true);
        localStorage.removeItem('tmpWrite');
        navigate('/');
        
      }
    },
    onError: (error) => {
      console.log("글쓰기 서버 오류", error);
    }
  });

  const postTagMutation = usePostTag({
    onSuccess: (response) => {
      console.log("태그 포스트 성공", response);
    },
    onError: (error) => {
      console.log("태그 포스트 서버 오류", error);
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

    const tagNames = tags;
    let tagIds = [];
    if (tagNames.length > 0) {
      const tagPromises = tagNames.map(tagName => postTagMutation.mutateAsync({ name: tagName }));
      const tagResponses = await Promise.all(tagPromises);
      tagIds = tagResponses.map(res => res.data.id);
    }

    writeMutation.mutate({ title, content: finalContent, slug, isPrivate, tagIds });
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
        //console.log(forDBSanitized);
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



  const correctTextMutation = useCorrectText({
    onSuccess: (data) => {
      const editor = editorRef.current;
      const editableArea = editor.core.context.element.wysiwyg;
      const previewContent = document.getElementById('preview_content');

      // Clone the editor's content for the preview
      const clonedContent = editableArea.cloneNode(true);
      console.log(data.corrections);
      let corrections = data.corrections;
      /*
      let corrections = {
        0: { wrong: "운영체제마다 별도의 전용 컴파일러가 필요하다", correct: "운영체제와 상관없이 JVM에서 실행되며, 컴파일러는 하나면 된다" },
        1: { wrong: "반드시 `include` 키워드로 외부 라이브러리를 불러와야 한다", correct: "`import` 키워드로 필요할 때만 외부 라이브러리를 불러온다" },
        2: { wrong: "`create`라는 키워드를 사용한다", correct: "`new` 키워드를 사용한다" },
        3: { wrong: "`public void main(String args)`", correct: "`public static void main(String[] args)`" },
        4: { wrong: "포인터 연산을 직접 지원하므로 메모리를 직접 조작할 수 있다", correct: "포인터 연산을 지원하지 않아 메모리를 직접 조작할 수 없다" },
        5: { wrong: "인터페이스는 하나의 클래스에서 두 개 이상 구현할 수 없다", correct: "하나의 클래스가 여러 개의 인터페이스를 구현할 수 있다" },
        6: { wrong: "`int`는 2바이트 크기를 가진다", correct: "`int`는 4바이트 크기를 가진다" },
        7: { wrong: "`try` 블록 없이 `catch`만 작성할 수 있다", correct: "`try` 블록 없이는 `catch`를 작성할 수 없다" },
        8: { wrong: "JVM은 소스 코드를 직접 실행하기 때문에 바이트코드로 변환되지 않는다", correct: "JVM은 소스 코드를 컴파일해 생성된 바이트코드를 실행한다" },
        9: { wrong: "가비지 컬렉션은 프로그래머가 명령어를 통해 수동으로 실행해야만 동작한다", correct: "가비지 컬렉션은 JVM이 자동으로 수행한다" }
      };
      */


      const traverseAndReplace = (node, isPreview) => {
        if (node.nodeType === Node.TEXT_NODE) {
          let content = node.textContent;
          let hasReplacement = false;
          
          for (let key in corrections) {
            if (corrections.hasOwnProperty(key) && !hasReplacement) {
              let correction = corrections[key];
              if (content.includes(correction.wrong)) {
                const textParts = content.split(correction.wrong);
                const fragment = document.createDocumentFragment();
  
                textParts.forEach((part, index) => {
                  fragment.appendChild(document.createTextNode(part));
                  if (index < textParts.length - 1) {
                    if (!isPreview) {
                      const animatedSpan = document.createElement('span');
                      animatedSpan.className = 'wave-text';
                      animatedSpan.textContent = correction.correct;
                      fragment.appendChild(animatedSpan);
                    } else {
                      // 프리뷰에서는 그냥 일반 텍스트로 추가
                      fragment.appendChild(document.createTextNode(correction.correct));
                    }
                  }
                });
  
                if (node.parentNode) {
                  node.parentNode.replaceChild(fragment, node);
                  hasReplacement = true; // 한 번 교체했으면 더 이상 처리하지 않음
                }
              }
            }
          }
        } else {
          // 자식 노드들을 역순으로 순회하여 노드가 제거되어도 인덱스 문제가 없도록 함
          for (let i = node.childNodes.length - 1; i >= 0; i--) {
            traverseAndReplace(node.childNodes[i], isPreview);
          }
        }
      };
  
      // Traverse and replace in the editor
      traverseAndReplace(editableArea, false);
  
      // Traverse and highlight in the cloned preview content
      traverseAndReplace(clonedContent, true);
  
      // Update the preview content
      previewContent.innerHTML = '';
      previewContent.appendChild(clonedContent);
  
      handleChange(editor.core.getContents());
      
      // AI 검토 완료 - blur 효과와 메시지 제거
      const editorContainer = document.querySelector('.editor-container');
      editorContainer.classList.remove('ai-reviewing');
      const aiMessage = document.querySelector('.ai-review-message');
      if (aiMessage && aiMessage.parentNode) {
        aiMessage.parentNode.removeChild(aiMessage);
      }
      
      // 성공 메시지 표시
      setPopupContent("AI 검토가 완료되었습니다!");
      setPopupColor("#4CAF50");
      setIsPopupVisible(true);
    },
    onError: (error) => {
      console.error('Error during AI review:', error);
      
      // AI 검토 실패 - blur 효과와 메시지 제거
      const editorContainer = document.querySelector('.editor-container');
      editorContainer.classList.remove('ai-reviewing');
      const aiMessage = document.querySelector('.ai-review-message');
      if (aiMessage && aiMessage.parentNode) {
        aiMessage.parentNode.removeChild(aiMessage);
      }
      
      // 에러 메시지 표시
      setPopupContent("AI 검토 중 오류가 발생했습니다.");
      setPopupColor("#e74c3c");
      setIsPopupVisible(true);
    }
  });

  


  const handleAiReview = () => {
    if (editorRef.current) {
      const pureText = editorRef.current.getText();
      
      // AI 검토 시작 - blur 효과와 메시지 추가
      const editorContainer = document.querySelector('.editor-container');
      editorContainer.classList.add('ai-reviewing');
      
      // AI 검토 메시지를 body에 추가 (blur 효과 밖에)
      const aiMessage = document.createElement('div');
      aiMessage.className = 'ai-review-message';
      aiMessage.innerHTML = '🌟 AI가 글 고치는중... 🌟';
      document.body.appendChild(aiMessage);
      
      // 애니메이션 시작과 동시에 서버 요청 보내기
      correctTextMutation.mutate(pureText);
      
      // 최대 10초 후 blur 효과 제거 (타임아웃 보호)
      setTimeout(() => {
        editorContainer.classList.remove('ai-reviewing');
        if (aiMessage.parentNode) {
          aiMessage.parentNode.removeChild(aiMessage);
        }
      }, 10000);
    }
  };

  const tempSave = () => {
    const dataToSave = {
      title,
      tags,
      content: sanitizedForTemp.current,
    };
    localStorage.setItem('tmpWrite', JSON.stringify(dataToSave));
    setPopupContent("포스트가 임시저장되었습니다.");
    setPopupColor("#4CAF50");
    setIsPopupVisible(true);
  }

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === ',' && tagInput.trim() !== '') {
      e.preventDefault();
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    } else if (e.key === 'Enter' && tagInput.trim() !== '') {
      e.preventDefault();
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    } else if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };


  return (
    <div className="write-container">
      <div className="write-editor">
        <form className="write-form" onSubmit={writing}>
          <div>
            <input 
              id='write_title' 
              type='text' 
              name='title' 
              placeholder='제목을 입력하세요' 
              onChange={(e) => setTitle(e.target.value)} 
              onKeyUp={(e) => handleTitle(e.target.value)} 
              value={title}
            />
            <div className="tag-input-container">
              {tags.map((tag, index) => (
                <div key={index} className="tag">
                  {tag}
                  <button type="button" className="remove-tag-button" onClick={() => removeTag(index)}>
                    &times;
                  </button>
                </div>
              ))}
              <input
                className="tag-input"
                type="text"
                placeholder="태그를 입력하세요 (쉼표 또는 엔터로 구분)"
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleTagInputKeyDown}
              />
            </div>
            <input type="hidden" name="slug" value={slug} />
            <input type="hidden" name="isPrivate" value={isPrivate} />
          </div>
          
          <div className={`editor-container ${isAiReviewActive ? 'ai-review-active' : ''}`}>
            <SunEditor
                getSunEditorInstance={(sunEditor) => { editorRef.current = sunEditor; }}
                onImageUploadBefore={handleImageUploadBefore}
                lang={SUNEDITOR_LANG}
                width="100%"
                height="auto"
                minHeight="400px"
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
            content={popupContent}
            color={popupColor}
            visible={isPopupVisible}
            onClose={() => setIsPopupVisible(false)}
          />
          <div className='button-container'>
            <div className='left'>
              <button type='button' className='go-back-button' onClick={() => navigate('/')}>← 나가기</button>
            </div>
            
            <div className='right'>
              <button type='button' className='save-tmp-button' onClick={tempSave}>임시저장</button>
              <button type='button' className='ai-review-button' onClick={handleAiReview}>AI 검토하기</button>
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