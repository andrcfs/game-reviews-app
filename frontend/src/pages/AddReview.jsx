import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

const AddReview = () => {
    const [formData, setFormData] = useState({
        gameId: '',
        rating: 5,
        reviewText: ''
    })
    const [games, setGames] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    // Load games on component mount
    useEffect(() => {
        loadGames()
    }, [])

    // Load games when search term changes
    useEffect(() => {
        if (searchTerm.trim()) {
            searchGames(searchTerm)
        } else {
            loadGames()
        }
    }, [searchTerm])

    const loadGames = async () => {
        try {
            const gamesData = await api.getAllGames()
            setGames(gamesData)
        } catch (err) {
            console.error('Error loading games:', err)
            setError('Failed to load games')
        }
    }

    const searchGames = async (term) => {
        try {
            const gamesData = await api.searchGamesByTitle(term)
            setGames(gamesData)
        } catch (err) {
            console.error('Error searching games:', err)
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!formData.gameId) {
            setError('Please select a game to review')
            return
        }

        setLoading(true)

        try {
            const token = localStorage.getItem('token')

            const reviewRequest = {
                rating: parseInt(formData.rating),
                comment: formData.reviewText,
                gameId: formData.gameId
            }

            await api.createReview(reviewRequest, token)

            setLoading(false)
            alert('Avaliação criada com sucesso!')
            navigate('/')
        } catch (err) {
            setLoading(false)
            setError(err.response?.data?.message || 'Erro ao criar avaliação')
            console.error('Erro ao criar avaliação:', err)
        }
    }

    // Find the selected game details
    const selectedGame = formData.gameId ? games.find(game => game.id === parseInt(formData.gameId)) : null

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center">Adicionar Avaliação</h1>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Buscar Jogo *
                    </label>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="input-field mb-2"
                        placeholder="Digite o nome do jogo..."
                    />

                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gameId">
                        Selecionar Jogo *
                    </label>
                    <select
                        id="gameId"
                        name="gameId"
                        value={formData.gameId}
                        onChange={handleChange}
                        className="input-field"
                        required
                    >
                        <option value="">Selecione um jogo</option>
                        {games.map(game => (
                            <option key={game.id} value={game.id}>
                                {game.title}
                            </option>
                        ))}
                    </select>

                    <div className="mt-2 text-sm">
                        <a href="/add-game" className="text-blue-500 hover:underline">
                            Não encontrou o jogo? Adicione um novo jogo aqui
                        </a>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rating">
                        Nota (1-5) *
                    </label>
                    <select
                        id="rating"
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        className="input-field"
                        required
                    >
                        <option value={1}>1 - Muito Ruim</option>
                        <option value={2}>2 - Ruim</option>
                        <option value={3}>3 - Regular</option>
                        <option value={4}>4 - Bom</option>
                        <option value={5}>5 - Excelente</option>
                    </select>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reviewText">
                        Sua Avaliação *
                    </label>
                    <textarea
                        id="reviewText"
                        name="reviewText"
                        value={formData.reviewText}
                        onChange={handleChange}
                        className="input-field h-32 resize-none"
                        placeholder="Escreva sua opinião sobre o jogo..."
                        required
                        minLength="10"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        Mínimo de 10 caracteres
                    </p>
                </div>

                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-bold mb-2">Preview da Avaliação:</h3>
                    <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-semibold text-lg">{selectedGame?.title || 'Nome do Jogo'}</h4>
                        <div className="flex items-center my-2">
                            <span className="text-yellow-500 mr-2">
                                {'★'.repeat(parseInt(formData.rating))}{'☆'.repeat(5 - parseInt(formData.rating))}
                            </span>
                            <span className="font-bold">{formData.rating}/5</span>
                        </div>
                        <p className="text-gray-700">
                            {formData.reviewText || 'Sua avaliação aparecerá aqui...'}
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="btn-primary flex-1"
                        disabled={loading}
                    >
                        {loading ? 'Salvando...' : 'Salvar Avaliação'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="btn-secondary flex-1"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddReview
