import { Link } from 'react-router-dom'

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
    const handleLogout = () => {
        // Limpar localStorage
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setIsLoggedIn(false)
    }

    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold press-start-2p-regular">Game Reviews</Link>

                <div className="flex space-x-7">
                    <Link to="/" className="hover:text-gray-300">Home</Link>

                    {isLoggedIn ? (
                        <>
                            <Link to="/add-review" className="hover:text-gray-300">Adicionar Avaliação</Link>
                            <Link to="/profile" className="hover:text-gray-300">Meu Perfil</Link>
                            <button
                                onClick={handleLogout}
                                className="hover:text-gray-300"
                            >
                                Sair
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-gray-300">Login</Link>
                            <Link to="/register" className="hover:text-gray-300">Cadastrar</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
