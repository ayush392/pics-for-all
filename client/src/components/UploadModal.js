import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import toast from "react-hot-toast";
const baseUrl = process.env.REACT_APP_BACKEND_URI;

function UploadModal({ modalOpen, setModalOpen }) {
    const [image, setImage] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);
    const [location, setLocation] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const { user } = useAuthContext();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (["image/jpg", "image/jpeg", "image/png"].includes(file.type) === false) {
                toast.error("Please select a valid image file (jpg, jpeg, png)");
                return;
            }
            setImage(file);
            setPreviewURL(URL.createObjectURL(file));
        }
    };

    async function handleSubmit(e) {
        e.preventDefault();
        if (!user) {
            toast.error("Please Login!")
            return;
        }
        if (!image) {
            toast.error("Please select an image to upload!");
            return;
        }
        setIsUploading(true);
        let formData = new FormData();
        formData.append("image", image);
        formData.append("location", location);
        try {
            const response = await fetch(`${baseUrl}/api/posts`, {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            const json = await response.json();
            if (!response.ok) {
                throw new Error(json.message);
            }

            toast.success(json.message);
            setIsUploading(false);
            setImage(null);
            setPreviewURL(null);
            setLocation("");
            setModalOpen(null);

        } catch (error) {
            console.log(error);
            setIsUploading(false);
            toast.error(error.message)
        }
    }

    const handleClear = () => {
        setImage(null);
        setPreviewURL(null);
        setLocation("");
    };

    return (
        <>
            {
                modalOpen && !user && alert("Please Login")
            }
            {modalOpen && user &&
                <div>
                    <div
                        className="position-fixed top-0 start-0 d-flex align-items-center bg-dark bg-opacity-50 h-100 w-100 p-3"
                        style={{ backdropFilter: 'blur(8px)', zIndex: '5' }}
                    >
                        <div
                            className="container position-relative bg-light rounded p-4 w-auto"
                            style={{ zIndex: '6', maxHeight: '80vh', overflowY: 'auto', maxWidth: '800px' }}
                        >
                            <h3 className="pb-3 pb-md-3">Submit a Photo</h3>

                            <div className="d-md-flex">
                                {/* Upload Box */}
                                <div className="w-100 w-md-50 d-flex flex-column align-items-center justify-content-start">
                                    <label
                                        htmlFor="fileInput"
                                        className="upload-box border border-secondary rounded d-flex justify-content-center align-items-center overflow-hidden mb-2"
                                        style={{
                                            width: '100%',
                                            maxWidth: '180px',
                                            aspectRatio: '1 / 1',
                                            cursor: 'pointer',
                                            backgroundColor: '#f8f9fa',
                                        }}
                                    >
                                        {previewURL ? (
                                            <img
                                                src={previewURL}
                                                alt="Preview"
                                                className="img-fluid rounded"
                                                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                            />
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="32"
                                                height="32"
                                                fill="currentColor"
                                                className="text-secondary"
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                            </svg>
                                        )}
                                        <input
                                            type="file"
                                            id="fileInput"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            style={{ display: 'none' }}
                                        />
                                    </label>

                                    <small className="text-muted">Supported formats: .jpg, .jpeg, .png</small>
                                </div>

                                {/* Form Area */}
                                <div className="w-100 mt-4 mt-md-0 ms-md-4 ms-lg-5 d-flex flex-column justify-content-between">
                                    <form>
                                        <div className="mb-3">
                                            <label className="form-label">Location</label>
                                            <input
                                                type="text"
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                className="form-control"
                                                placeholder="Where was this photo taken?"
                                            />
                                        </div>

                                        <div className="form-text text-secondary mb-2">
                                            <strong>Note:- </strong> AI will auto-generate tags and description from your image. You can edit them later.
                                        </div>
                                    </form>

                                    <div className="ms-auto mt-4">
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger me-4 fs-6 px-3"
                                            onClick={handleClear}
                                            disabled={isUploading}
                                        >
                                            Clear
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-sm btn-dark fs-6 px-3"
                                            onClick={handleSubmit}
                                            disabled={isUploading}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="btn-close position-absolute top-0 left-0 end-0 me-4 mt-4"
                                aria-label="Close"
                                onClick={() => { handleClear(); setModalOpen(null) }}
                            ></button>
                        </div>
                    </div>
                </div>



                // <div>
                //     <div className={`position-fixed top-0 start-0 d-flex align-items-center bg-dark bg-opacity-50 h-100 w-100 p-3`} style={{ backdropFilter: 'blur(8px)', zIndex: '5' }}>
                //         <div className="container position-relative bg-light rounded p-4 w-auto" style={{ zIndex: '6', maxHeight: '80vh' }}>
                //             <h2 className=" pb-3 pb-md-3 ">Submit a photo</h2>

                //             <div className="d-md-flex">
                //                 <div className='w-100'>
                //                     <div className="d-flex flex-column align-items-center mt-4">
                //                         <label
                //                             htmlFor="fileInput"
                //                             className="upload-box border border-secondary rounded d-flex justify-content-center align-items-center overflow-hidden"
                //                             style={{
                //                                 width: '150px',
                //                                 height: '150px',
                //                                 cursor: 'pointer',
                //                                 backgroundColor: '#f8f9fa',
                //                                 position: 'relative',
                //                             }}
                //                         >
                //                             {previewURL ? (
                //                                 <img src={previewURL} alt="Preview"
                //                                     style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                //                                 />
                //                             ) : (
                //                                 <svg
                //                                     xmlns="http://www.w3.org/2000/svg"
                //                                     width="40"
                //                                     height="40"
                //                                     fill="currentColor"
                //                                     className="text-secondary"
                //                                     viewBox="0 0 16 16"
                //                                 >
                //                                     <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                //                                 </svg>
                //                             )}
                //                         </label>

                //                         <input
                //                             type="file"
                //                             id="fileInput"
                //                             accept="image/*"
                //                             onChange={handleImageChange}
                //                             style={{ display: 'none' }}
                //                         />
                //                         <label className=" form-text text-secondary">.jpg, .jpeg, .png</label>

                //                     </div>
                //                 </div>
                //                 <div className="w-100 mt-4 mt-md-0 ms-md-4 ms-lg-5 d-flex flex-column justify-content-between">
                //                     <form>
                //                         <div className="mb-3">
                //                             <label className="form-label">Location</label>
                //                             <input
                //                                 type="text"
                //                                 value={location}
                //                                 onChange={(e) => setLocation(e.target.value)}
                //                                 className="form-control"
                //                             />
                //                         </div>
                //                         <label className=" form-text text-danger bold">
                //                             Tags and description will be automatically generated using AI based on your uploaded image.
                //                             You can review and update them later if needed.
                //                         </label>
                //                     </form>
                //                     <div className={`ms-auto mt-4`}>
                //                         <button
                //                             type="button"
                //                             className="btn btn-sm btn-outline-danger me-4 fs-6 px-3"
                //                             onClick={handleClear}
                //                             disabled={isUploading}
                //                         >
                //                             Clear
                //                         </button>
                //                         <button
                //                             type="submit"
                //                             className="btn btn-sm  btn-dark fs-6 px-3"
                //                             onClick={handleSubmit}
                //                             disabled={isUploading}
                //                         >
                //                             Submit
                //                         </button>
                //                     </div>
                //                 </div>
                //             </div>

                //             <button type="button" className="btn-close d-inline position-absolute top-0 left-0 end-0 me-4 mt-4" aria-label="Close" onClick={() => setModalOpen(null)}></button>

                //         </div>
                //     </div>
                // </div>
            }
        </>
    );
}

export default UploadModal;
