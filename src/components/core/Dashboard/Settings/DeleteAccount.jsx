import { useState } from "react"
import { FiTrash2 } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { deleteProfile } from "../../../../services/operations/SettingsAPI"

export default function DeleteAccount() {
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)

  const confirmDelete = () => {
    dispatch(deleteProfile(token, navigate))
    setShowModal(false)
  }

  return (
    <>
      <div className="my-10 flex gap-5 rounded-md border border-pink-700 bg-pink-900 p-8 px-12">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-700">
          <FiTrash2 className="text-3xl text-pink-200" />
        </div>
        <div className="flex flex-col space-y-2">
          <h2 className="text-lg font-semibold text-richblack-5">
            Delete Account
          </h2>
          <div className="w-3/5 text-pink-25">
            <p>Would you like to delete your account?</p>
            <p>
              This account may contain paid courses. Deleting it is permanent and removes all data.
            </p>
          </div>
          <button
            className="w-fit cursor-pointer italic text-pink-300"
            onClick={() => setShowModal(true)}
          >
            I want to delete my account.
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-lg bg-richblack-800 p-6">
            <h3 className="text-xl font-bold text-richblack-5 mb-4">Confirm Deletion</h3>
            <p className="text-richblack-200 mb-6">
              Are you sure you want to permanently delete your account? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-richblack-700 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-pink-700 text-white rounded-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
