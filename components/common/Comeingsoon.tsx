import Link from "next/link"
const Comeingsoon = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center p-4">
      <div>
        <h1 className="display-5 fw-bold text-primary mb-3">Comeing Soon</h1>
        <p className="text-muted mb-4">Our website is under construction. Stay tuned!</p>
        <div className="d-flex gap-3 justify-content-center">
          <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/`} className="eclick-btn-home">
            <i className="bi bi-house-door me-2"></i> Return Home
          </Link>
        </div>
      </div>

      <footer className="mt-5 text-muted small">
        &copy; {new Date().getFullYear()} <Link href="https://www.eclicksoftwares.com/" target="_blank">Eclicksoftwares</Link>. All rights reserved.
      </footer>
    </div>
  )
}

export default Comeingsoon
