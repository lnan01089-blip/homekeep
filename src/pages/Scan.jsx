import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Camera,
  Flashlight,
  Image as ImageIcon,
  RefreshCw,
  RotateCcw,
  X,
  Zap,
} from 'lucide-react'
import pantryImg from '../assets/products/pantry.jpg'
import { useStore } from '../store'

export default function Scan() {
  const { back, navigate, toast } = useStore()
  const [mode, setMode] = useState('camera')
  const [capturedImage, setCapturedImage] = useState(null)
  const [cameraState, setCameraState] = useState('requesting')
  const [cameraError, setCameraError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [torchAvailable, setTorchAvailable] = useState(false)
  const [torchOn, setTorchOn] = useState(false)
  const [flashFrame, setFlashFrame] = useState(false)
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const fileRef = useRef(null)

  const stopCamera = useCallback(() => {
    const stream = streamRef.current
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) videoRef.current.srcObject = null
    setTorchOn(false)
    setTorchAvailable(false)
  }, [])

  useEffect(() => {
    let cancelled = false

    if (mode !== 'camera') {
      stopCamera()
      return undefined
    }

    const openCamera = async () => {
      setCameraState('requesting')
      setCameraError('')
      if (!navigator.mediaDevices?.getUserMedia) {
        if (!cancelled) {
          setCameraState('unavailable')
          setCameraError('当前浏览器不支持相机')
        }
        return
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        })
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }
        streamRef.current = stream
        const track = stream.getVideoTracks()[0]
        const capabilities = track?.getCapabilities?.()
        setTorchAvailable(Boolean(capabilities?.torch))
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play().catch(() => {})
        }
        setCameraState('live')
      } catch (error) {
        if (cancelled) return
        const name = error?.name || ''
        if (name === 'NotAllowedError' || name === 'SecurityError') {
          setCameraState('denied')
          setCameraError('请在浏览器设置中允许相机权限')
        } else if (name === 'NotFoundError' || name === 'OverconstrainedError') {
          setCameraState('unavailable')
          setCameraError('未检测到可用相机')
        } else if (name === 'NotReadableError') {
          setCameraState('unavailable')
          setCameraError('相机正被其他应用占用')
        } else {
          setCameraState('unavailable')
          setCameraError('相机暂时无法打开')
        }
      }
    }

    openCamera()
    return () => {
      cancelled = true
      stopCamera()
    }
  }, [mode, attempt, stopCamera])

  useEffect(() => () => stopCamera(), [stopCamera])

  const takePhoto = () => {
    if (cameraState !== 'live' || flashFrame) return
    const video = videoRef.current
    if (!video || !video.videoWidth) {
      toast('相机正在准备，请稍候')
      return
    }
    setFlashFrame(true)
    const canvas = document.createElement('canvas')
    const scale = Math.min(1, 1280 / Math.max(video.videoWidth, video.videoHeight))
    canvas.width = Math.round(video.videoWidth * scale)
    canvas.height = Math.round(video.videoHeight * scale)
    const context = canvas.getContext('2d')
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    const image = canvas.toDataURL('image/jpeg', 0.84)
    window.setTimeout(() => {
      setCapturedImage(image)
      setMode('preview')
      setFlashFrame(false)
    }, 120)
  }

  const toggleTorch = async () => {
    const track = streamRef.current?.getVideoTracks?.()[0]
    if (!track || !torchAvailable) {
      toast('当前设备没有可用闪光灯')
      return
    }
    try {
      const next = !torchOn
      await track.applyConstraints({ advanced: [{ torch: next }] })
      setTorchOn(next)
    } catch {
      toast('无法切换闪光灯')
    }
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
    stopCamera()
    navigate('add', {
      scanned: true,
      imageUrl: capturedImage,
      source: 'scan',
    })
    toast('照片已导入，请核对演示信息', { duration: 2400 })
  }

  const retryCamera = () => {
    stopCamera()
    setAttempt((value) => value + 1)
  }

  const fallbackImage = mode === 'preview' && capturedImage ? capturedImage : pantryImg

  return (
    <div className={`scan-page ${mode === 'preview' ? 'is-preview' : ''}`}>
      <div
        className="camera-stage"
        style={{ backgroundImage: `url(${fallbackImage})` }}
      >
        {mode === 'camera' && (
          <video
            ref={videoRef}
            className={`camera-video ${cameraState === 'live' ? 'is-visible' : ''}`}
            autoPlay
            muted
            playsInline
            aria-label="相机实时画面"
          />
        )}
        <div className="camera-vignette" />
        <div className="camera-grain" />
        {flashFrame && <div className="camera-flash" />}

        <div className="scan-topbar">
          <button className="scan-round-button" onClick={back} aria-label="关闭扫描">
            <X size={21} />
          </button>
          <div className="scan-mode-label">
            <span />
            拍照识别
          </div>
          <button
            className={`scan-round-button ${torchOn ? 'is-on' : ''}`}
            onClick={toggleTorch}
            aria-label="切换闪光灯"
          >
            <Flashlight size={20} />
          </button>
        </div>

        {mode === 'camera' ? (
          <>
            <div className="scan-instruction-top">
              <p>将物品或标签置于取景框内</p>
            </div>

            <div className="scanner-area">
              <div className={`scanner-frame ${cameraState === 'live' ? 'is-live' : ''}`}>
                <span className="corner tl" />
                <span className="corner tr" />
                <span className="corner bl" />
                <span className="corner br" />
                {cameraState === 'live' && <span className="scan-line" />}
              </div>

              {cameraState !== 'live' && (
                <div className="camera-permission-card">
                  <span className="camera-permission-icon">
                    {cameraState === 'requesting' ? (
                      <span className="camera-spinner" />
                    ) : (
                      <Camera size={20} />
                    )}
                  </span>
                  <strong>
                    {cameraState === 'requesting' ? '正在打开相机' : '无法访问相机'}
                  </strong>
                  {cameraState !== 'requesting' && (
                    <>
                      <p>{cameraError}</p>
                      <button onClick={retryCamera}>
                        <RefreshCw size={14} />
                        重试
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="camera-controls">
              <button className="gallery-button" onClick={() => fileRef.current?.click()}>
                <span>
                  <ImageIcon size={19} />
                </span>
                相册
              </button>
              <button
                className={`shutter-button ${cameraState !== 'live' ? 'is-disabled' : ''}`}
                onClick={takePhoto}
                disabled={cameraState !== 'live'}
                aria-label="拍照"
              >
                <span className="shutter-inner">
                  <Camera size={24} />
                </span>
              </button>
              <span />
            </div>
          </>
        ) : (
          <div className="photo-preview-overlay">
            <div className="preview-topbar">
              <button className="scan-round-button" onClick={back} aria-label="关闭扫描">
                <X size={21} />
              </button>
              <span>照片预览</span>
              <span className="preview-top-spacer" />
            </div>

            <div className="preview-image-frame">
              <img src={capturedImage} alt="刚拍摄的物品照片" />
              <span className="preview-corners tl" />
              <span className="preview-corners tr" />
              <span className="preview-corners bl" />
              <span className="preview-corners br" />
            </div>

            <div className="preview-bottom">
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
      <input type="file" accept="image/*" ref={fileRef} onChange={handleFile} hidden />
    </div>
  )
}
