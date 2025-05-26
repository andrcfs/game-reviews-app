import { useEffect, useState } from 'react'
import { api } from '../services/api'

const Home = () => {
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await api.getAllReviews()
                setReviews(response.data)
                setLoading(false)
            } catch (err) {
                setError('Falha ao carregar avaliações')
                setLoading(false)
                console.error('Erro ao buscar avaliações:', err)
            }
        }

        fetchReviews()
    }, [])

    if (loading) {
        return <div className="text-center py-10">Carregando avaliações...</div>
    }

    if (error) {
        return <div className="text-center text-red-500 py-10">{error}</div>
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-center">Avaliações Recentes</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map(review => (
                    <div key={review._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start">
                            <h2 className="text-xl font-semibold mb-2">{review.gameTitle}</h2>
                            <div className="flex items-center bg-blue-500 text-white px-2 py-1 rounded">
                                <span className="font-bold">{review.rating}</span>/5
                            </div>
                        </div>

                        <div className="mb-4">
                            <img
                                src={review.gameImage || 'https://via.placeholder.com/300x150?text=Game+Image'}
                                alt={review.gameTitle}
                                className="w-full h-40 object-cover rounded my-3"
                            />
                        </div>

                        <p className="text-gray-700 mb-4">{review.reviewText}</p>

                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Por: {review.user.username}</span>
                            <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Home
