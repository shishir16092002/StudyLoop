// src/components/Settings/Profile/ChangeProfilePicture.jsx
import { useEffect, useRef, useState } from "react"
import { FiUpload } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"

import { updateDisplayPicture } from "../../../../services/operations/SettingsAPI"
import IconBtn from "../../../common/IconBtn"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

export default function ChangeProfilePicture() {
  const { token } = useSelector((state) => state.auth)
  const { user }  = useSelector((state) => state.profile)
  const dispatch  = useDispatch()

  const [imageFile, setImageFile] = useState(null)
  const [preview,   setPreview]   = useState(null)
  const [loading,   setLoading]   = useState(false)

  const fileInputRef = useRef(null)

  /* ------------------------------------------------------------------ */
  /*  Fallback avatar (user initials)                                   */
  /* ------------------------------------------------------------------ */
  const fullName       = `${user?.firstName || "User"} ${user?.lastName || ""}`.trim()
  const fallbackAvatar = `https://avatar.oxro.io/avatar.svg?name=${encodeURIComponent(fullName)}`

  /* ------------------------------------------------------------------ */
  /*  Build preview whenever a new file is chosen                       */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!imageFile) {
      setPreview(null)
      return
    }
    const reader = new FileReader()
    reader.readAsDataURL(imageFile)
    reader.onloadend = () => setPreview(reader.result)
  }, [imageFile])

  /* ------------------------------------------------------------------ */
  /*  Handlers                                                          */
  /* ------------------------------------------------------------------ */
  const openFilePicker = () => fileInputRef.current?.click()

  const onFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > MAX_FILE_SIZE) {
      // TODO: toast.warn('File too large')
      return
    }
    setImageFile(file)
  }

  const uploadHandler = async () => {
    if (!imageFile) return
    try {
      setLoading(true)
      const fd = new FormData()
      fd.append("displayPicture", imageFile)
      await dispatch(updateDisplayPicture(token, fd))
      // reset local state after success
      setImageFile(null)
      setPreview(null)
    } catch (err) {
      console.error("Display-picture upload failed:", err)
    } finally {
      setLoading(false)
    }
  }

  /* ------------------------------------------------------------------ */
  /*  JSX                                                               */
  /* ------------------------------------------------------------------ */
  return (
    <div className="flex items-center justify-between rounded-md border border-richblack-700 bg-richblack-800 p-8 px-12 text-richblack-5">
      <div className="flex items-center gap-x-4">
        {/* current / preview / fallback avatar */}
        <img
          src={preview || user?.image || fallbackAvatar}
          alt={`profile-${user?.firstName || "user"}`}
          className="aspect-square w-[78px] rounded-full object-cover"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = fallbackAvatar
          }}
        />

        <div className="space-y-2">
          <p>Change Profile Picture</p>

          <div className="flex gap-3">
            {/* hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileChange}
            />

            {/* Select button */}
            <button
              type="button"
              onClick={openFilePicker}
              disabled={loading}
              className="cursor-pointer rounded-md bg-richblack-700 px-5 py-2 font-semibold text-richblack-50 disabled:opacity-60"
            >
              Select
            </button>

            {/* Upload button */}
            <IconBtn
              text={loading ? "Uploading..." : "Upload"}
              disabled={loading || !imageFile}
              onclick={uploadHandler}
            >
              {!loading && <FiUpload className="text-lg text-richblack-900" />}
            </IconBtn>
          </div>
        </div>
      </div>
    </div>
  )
}
