import { useRef, useState } from 'react'
import {
  Camera,
  Check,
  ChevronLeft,
  Flashlight,
  Image as ImageIcon,
  RotateCcw,
  ScanBarcode,
  ScanLine,
  Sparkles,
  X,
  Zap,
} from 'lucide-react'
import milkImg from '../assets/products/milk.jpg'
import pantryImg from '../assets/products/pantry.jpg'
import { useStore } from '../store'

export default function Scan() {
  const { back, navigate, toast } = useStore()
  const [mode, setMode] = useState('camera')
  const [flash, setFlash] = useState(false)
  const [lightOn, setLightOn] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const [flashFrame, setFlashFrame] = useState(false)
  const fileRef = useRef(null)

  const takePhoto = () => {
    if (flashFrame) return
    setFlashFrame(true)
    setTimeout(() => setCapturedImage(milkImg), 80)
    setTimeout(() => {
      setMode('preview')
      setFlashFrame(false)
    }, 280)
  }

  const handleFile = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setCapturedImage(reader.result)
      setMode('preview')
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  const confirmPhoto = () => {
    navigate('add', {
      scanned: true,
      imageUrl: capturedImage,
      source: 'scan',
    })
    toast('照片已导入，请确认识别结果', { duration: 2600 })
  }

  return (
    <div className={`scan-page ${mode === 'preview' ? 'is-preview' : ''}`}>
      <div
        className="camera-stage"
        style={{ backgroundImage: `url(${mode === 'preview' ? capturedImage : pantryImg})` }}
      >
        <div className="camera-vignette" />
        <div className="camera-grain" />
        {flashFrame && <div className="camera-flash" />}

        <div className="scan-topbar">
          <button className="scan-round-button" onClick={back} aria-label="关闭扫描">
            <X size={21} />
          </button>
          <div className="scan-mode-label">
            <span />
            智能扫描
          </div>
          <button
            className={`scan-round-button ${lightOn ? 'is-on' : ''}`}
            onClick={() => {
              setLightOn((value) => !value)
              setFlash(true)
              setTimeout(() => setFlash(false), 180)
            }}
            aria-label="切换闪光灯"
          >
            <Flashlight size={20} />
          </button>
        </div>

        {mode === 'camera' ? (
          <>
            <div className="scan-instruction-top">
              <span className="scan-ai-pill">
                <Sparkles size={12} />
                智能识别
              </span>
              <p>将物品包装或标签对准扫描框</p>
            </div>

            <div className="scanner-area">
              <div className="scanner-frame">
                <span className="corner tl" />
                <span className="corner tr" />
                <span className="corner bl" />
                <span className="corner br" />
                <span className="scan-line" />
                <span className="scan-target-dot" />
              </div>
              <div className="scanner-float-tag">
                <span className="tag-dot" />
                正在寻找文字与日期…
              </div>
            </div>

            <div className="scan-support-row">
              <span>包装</span>
              <i />
              <span>产品标签</span>
              <i />
              <span>条形码</span>
              <i />
              <span>有效期</span>
            </div>

            <div className="camera-controls">
              <button className="gallery-button" onClick={() => fileRef.current?.click()}>
                <span>
                  <ImageIcon size={19} />
                </span>
                相册
              </button>
              <button className="shutter-button" onClick={takePhoto} aria-label="拍照">
                <span className="shutter-inner">
                  <Camera size={24} />
                </span>
              </button>
              <button
                className="scan-demo-button"
                onClick={() => toast('这是模拟相机，点按快门即可体验完整流程')}
              >
                <ScanBarcode size={18} />
                演示
              </button>
            </div>
            <p className="camera-disclaimer">第一版为模拟扫描，不会上传任何照片</p>
            {flash && <div className="camera-flash soft" />}
            <input type="file" accept="image/*" ref={fileRef} onChange={handleFile} hidden />
          </>
        ) : (
          <div className="photo-preview-overlay">
            <div className="preview-topbar">
              <button className="scan-round-button" onClick={() => setMode('camera')} aria-label="重新拍摄">
                <ChevronLeft size={21} />
              </button>
              <div>
                <span>照片预览</span>
                <small>确认清晰后再继续</small>
              </div>
              <span className="preview-step">1 / 2</span>
            </div>

            <div className="preview-image-frame">
              <img src={capturedImage} alt="刚拍摄的物品照片" />
              <span className="preview-corners tl" />
              <span className="preview-corners tr" />
              <span className="preview-corners bl" />
              <span className="preview-corners br" />
              <span className="preview-ready-tag">
                <Check size={13} />
                已为你拍下照片
              </span>
            </div>

            <div className="preview-bottom">
              <div className="preview-tip">
                <ScanLine size={15} />
                下一步会模拟识别物品信息，并打开添加物品页面
              </div>
              <div className="preview-actions">
                <button className="retake-button" onClick={() => setMode('camera')}>
                  <RotateCcw size={17} />
                  重新拍摄
                </button>
                <button className="use-photo-button" onClick={confirmPhoto}>
                  <Zap size={17} />
                  使用这张照片
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
