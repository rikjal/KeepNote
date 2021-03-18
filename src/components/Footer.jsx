import React from 'react'

function Footer() {
    const year = new Date().getFullYear()
    return (
        <>
            <footer className="text-center mt-4">
                <p className="text-light"> Copyright ©️ Saptarshi Roy, {year} ❤️ </p>
            </footer>
        </>
    )
}

export default Footer