import React, { useState } from 'react';
import { useCookies } from 'react-cookie';

const Modal = ({ mode, setShowModal, task, getData }) => {
    const [cookies] = useCookies(null);

    const editMode = mode === 'edit' ? true : false;

    const [data, setData] = useState({
        user_email: editMode ? task.user_email : cookies.email,
        title: editMode ? task.title : null,
        progress: editMode ? task.progress : 50,
        date: editMode ? task.date : new Date(),
    });

    const postData = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_SERVER_URL}/todos`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                }
            );
            if (response.status === 200) {
                setShowModal(false);
                getData();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const updateData = async () => {
        const id = task.id;
        try {
            const response = await fetch(
                `${process.env.REACT_APP_SERVER_URL}/todos/${id}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                }
            );
            if (response.status === 200) {
                setShowModal(false);
                getData();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        editMode ? updateData() : postData();
    };

    return (
        <div className="overlay">
            <div className="modal">
                <div className="form-title-container">
                    <h3>Let's {mode} yopur tasks</h3>
                    <button
                        className="cursor"
                        type="button"
                        onClick={() => setShowModal(false)}>
                        X
                    </button>
                </div>

                <form>
                    <input
                        required
                        maxLength={30}
                        type="text"
                        placeholder={'Name your task'}
                        name="title"
                        value={data.title}
                        onChange={handleChange}
                    />
                    <br />
                    <label htmlFor="progress">
                        Drag to select your current progress
                    </label>
                    <input
                        required
                        id="proress"
                        type="range"
                        min={0}
                        max={100}
                        name="progress"
                        value={data.progress}
                        onChange={handleChange}
                    />
                    <input
                        type="submit"
                        className={mode}
                        onClick={handleSubmit}
                    />
                </form>
            </div>
        </div>
    );
};

export default Modal;
