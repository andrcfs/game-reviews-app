import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

const AddGame = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        genre: '',
        platforms: [],
        imageUrl: ''
    })
    const [error, setError] = useState('')
    const [errorType, setErrorType] = useState('') // Added for different error types
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false) // Added for success state
    const navigate = useNavigate()

    const availablePlatforms = [
        'PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X/S',
        'Xbox One', 'Nintendo Switch', 'Mobile', 'Mac'
    ]

    const genres = [
        'Action', 'Adventure', 'RPG', 'Strategy', 'Simulation',
        'Sports', 'Racing', 'Fighting', 'Puzzle', 'Horror', 'Indie'
    ]

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handlePlatformChange = (platform) => {
        const updatedPlatforms = formData.platforms.includes(platform)
            ? formData.platforms.filter(p => p !== platform)
            : [...formData.platforms, platform]

        setFormData({
            ...formData,
            platforms: updatedPlatforms
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setErrorType('')
        setSuccess(false)
        setLoading(true)

        try {
            const token = localStorage.getItem('token')
            if (!token) {
                setError('Você precisa estar logado para adicionar um jogo')
                setErrorType('auth')
                setLoading(false)
                return
            }

            await api.createGameComplete(formData, token)

            setLoading(false)
            setSuccess(true)

            // Redirect after a short delay to allow the user to see the success message
            setTimeout(() => {
                navigate('/')
            }, 2000)
        } catch (err) {
            setLoading(false)

            // Handle different error types
            if (!err.response) {
                setError('Não foi possível conectar ao servidor. Por favor, verifique sua conexão com a internet.')
                setErrorType('network')
            } else if (err.response.status === 401 || err.response.status === 403) {
                setError('Você não tem permissão para adicionar jogos ou sua sessão expirou.')
                setErrorType('auth')
            } else if (err.response.status === 400) {
                setError(err.response.data.message || 'Dados inválidos. Verifique os campos e tente novamente.')
                setErrorType('validation')
            } else if (err.response.status === 409) {
                setError('Este jogo já existe no sistema.')
                setErrorType('duplicate')
            } else {
                setError(err.response?.data?.message || 'Erro ao adicionar jogo. Tente novamente mais tarde.')
                setErrorType('general')
            }

            console.error('Erro ao adicionar jogo:', err)
        }
    }

    // Error message component based on error type
    const renderErrorMessage = () => {
        if (!error) return null;

        const errorClasses = {
            network: "bg-red-100 border border-red-400 text-red-700",
            auth: "bg-yellow-100 border border-yellow-400 text-yellow-700",
            validation: "bg-orange-100 border border-orange-400 text-orange-700",
            duplicate: "bg-blue-100 border border-blue-400 text-blue-700",
            general: "bg-red-100 border border-red-400 text-red-700"
        };

        const className = errorClasses[errorType] || errorClasses.general;

        return (
            <div className={`${className} px-4 py-3 rounded relative mb-4`} role="alert">
                <strong className="font-bold">Erro! </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        );
    };

    // Success message component
    const renderSuccessMessage = () => {
        if (!success) return null;

        return (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Sucesso! </strong>
                <span className="block sm:inline">Jogo adicionado com sucesso! Redirecionando...</span>
            </div>
        );
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center">Adicionar Novo Jogo</h1>

            {renderErrorMessage()}
            {renderSuccessMessage()}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                        Título do Jogo *
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Ex: The Legend of Zelda: Breath of the Wild"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                        Descrição
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="input-field h-24 resize-none"
                        placeholder="Descreva o jogo..."
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="genre">
                        Gênero
                    </label>
                    <select
                        id="genre"
                        name="genre"
                        value={formData.genre}
                        onChange={handleChange}
                        className="input-field"
                    >
                        <option value="">Selecione um gênero</option>
                        {genres.map(genre => (
                            <option key={genre} value={genre}>{genre}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Plataformas
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {availablePlatforms.map(platform => (
                            <label key={platform} className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.platforms.includes(platform)}
                                    onChange={() => handlePlatformChange(platform)}
                                    className="mr-2"
                                />
                                {platform}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imageUrl">
                        URL da Imagem
                    </label>
                    <input
                        type="url"
                        id="imageUrl"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="https://exemplo.com/imagem.jpg"
                    />
                </div>

                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-bold mb-2">Preview do Jogo:</h3>
                    <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-semibold text-lg">{formData.title || 'Título do Jogo'}</h4>
                        {formData.genre && <p className="text-sm text-gray-600">Gênero: {formData.genre}</p>}
                        {formData.platforms.length > 0 && (
                            <p className="text-sm text-gray-600">
                                Plataformas: {formData.platforms.join(', ')}
                            </p>
                        )}
                        {formData.imageUrl && (
                            <img
                                src={formData.imageUrl}
                                alt="Preview"
                                className="mt-2 max-w-32 h-auto rounded"
                                onError={(e) => { e.target.style.display = 'none' }}
                            />
                        )}
                        <p className="text-gray-700 mt-2">
                            {formData.description || 'Descrição do jogo aparecerá aqui...'}
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="btn-primary flex-1"
                        disabled={loading}
                    >
                        {loading ? 'Salvando...' : 'Salvar Jogo'}
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

export default AddGame
