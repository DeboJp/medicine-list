// components/Navbar.js
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4">
        <li>
          <Link href="/home" legacyBehavior>
            <a className="text-white">| Home |</a>
          </Link>
        </li>
        <li>
          <Link href="/" legacyBehavior>
            <a className="text-white">| Medicine List - DataBase |</a>
          </Link>
        </li>
        <li>
          <Link href="/search" legacyBehavior>
            <a className="text-white">| Search |</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
