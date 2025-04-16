import React from 'react'

function Avatar(props) {
    const avatarStyle = {
        height: props.w,
        width: props.w,
        borderRadius: '50%',
        display: 'inline-block',
        border: "1px solid lightgray",
        objectFit: 'cover',
    }

    return <img src={props.avatar} alt="profile pic" style={avatarStyle} />

}

export default Avatar