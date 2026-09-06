import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 text-center">
        <span className="font-display text-lg text-ink">THRIFT WEARs</span>
        <p className="max-w-sm text-sm text-stone">
          One-of-one thrift finds from Nairobi, sourced piece by piece. Message us on WhatsApp to make it yours.
        </p>
        <div className="mt-2 flex gap-6 text-sm text-stone">
          <Link to="/shop" className="hover:text-ink">Shop</Link>
          <Link to="/about" className="hover:text-ink">About</Link>
          <Link to="/contact" className="hover:text-ink">Contact</Link>
        </div>
      </div>
    </footer>
  )
}
