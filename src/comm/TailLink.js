import React from 'react'
import { Link } from 'react-router-dom'
const TailLink = ({href, title, handleClick}) => {
    return (
        <Link to={href} className="text-slate-700 hover:text-red-600 p-2 m-2" onClick={handleClick}>{title}</Link>
    )
}

export default TailLink

