import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

const AddReview = () => {
    const [formData, setFormData] = useState({
        gameTitle: '',
        rating: 5,
        reviewText: '',
        gameImage: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const token = localStorage.getItem('token')
            await api.createReview(null, formData, token)

            setLoading(false)
            alert('Avaliação criada com sucesso!')
            navigate('/')
        } catch (err) {
            setLoading(false)
            setError(err.response?.data?.message || 'Erro ao criar avaliação')
            console.error('Erro ao criar avaliação:', err)
        }
    }

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
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gameTitle">
                        Nome do Jogo *
                    </label>
                    <input
                        type="text"
                        id="gameTitle"
                        name="gameTitle"
                        value={formData.gameTitle}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Ex: The Legend of Zelda: Breath of the Wild"
                        required
                    />
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

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gameImage">
                        URL da Imagem (opcional)
                    </label>
                    <input
                        type="url"
                        id="gameImage"
                        name="gameImage"
                        value={formData.gameImage}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="https://exemplo.com/imagem.jpg"
                    />
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
                        <h4 className="font-semibold text-lg">{formData.gameTitle || 'Nome do Jogo'}</h4>
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
