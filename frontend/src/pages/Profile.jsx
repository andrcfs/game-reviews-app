import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'

const Profile = () => {
    const [user, setUser] = useState(null)
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [stats, setStats] = useState({
        totalReviews: 0,
        averageRating: 0,
        gamesReviewed: 0
    })

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token')

                // Buscar dados do usuário
                const userResponse = await api.getMe(token)

                // Buscar avaliações do usuário
                const reviewsResponse = await api.getUserReviews(userResponse.data._id)

                setUser(userResponse.data)
                setReviews(reviewsResponse.data)

                // Calcular estatísticas
                const totalReviews = reviewsResponse.data.length
                const averageRating = totalReviews > 0
                    ? reviewsResponse.data.reduce((acc, review) => acc + review.rating, 0) / totalReviews
                    : 0

                setStats({
                    totalReviews,
                    averageRating: averageRating.toFixed(1),
                    gamesReviewed: totalReviews
                })

                setLoading(false)
            } catch (err) {
                setError('Erro ao carregar dados do perfil')
                setLoading(false)
                console.error('Erro ao buscar dados do perfil:', err)
            }
        }

        fetchUserData()
    }, [])

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('Tem certeza de que deseja excluir esta avaliação?')) {
            return
        }

        try {
            const token = localStorage.getItem('token')
            await api.deleteReview(reviewId, token)

            setReviews(reviews.filter(review => review._id !== reviewId))
            alert('Avaliação excluída com sucesso!')
        } catch (err) {
            setError('Erro ao excluir avaliação')
            console.error('Erro ao excluir avaliação:', err)
        }
    }

    if (loading) {
        return <div className="text-center py-10">Carregando perfil...</div>
    }

    if (error) {
        return <div className="text-center text-red-500 py-10">{error}</div>
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header do Perfil */}
            <div className="card mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">{user?.username}</h1>
                        <p className="text-gray-600">{user?.email}</p>
                        <p className="text-sm text-gray-500">
                            Membro desde {new Date(user?.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="text-right">
                        <Link
                            to="/add-review"
                            className="btn-primary"
                        >
                            Nova Avaliação
                        </Link>
                    </div>
                </div>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card text-center">
                    <h3 className="text-2xl font-bold text-blue-500">{stats.totalReviews}</h3>
                    <p className="text-gray-600">Avaliações</p>
                </div>
                <div className="card text-center">
                    <h3 className="text-2xl font-bold text-green-500">{stats.averageRating}</h3>
                    <p className="text-gray-600">Nota Média</p>
                </div>
                <div className="card text-center">
                    <h3 className="text-2xl font-bold text-purple-500">{stats.gamesReviewed}</h3>
                    <p className="text-gray-600">Jogos Avaliados</p>
                </div>
            </div>

            {/* Lista de Avaliações */}
            <div className="card">
                <h2 className="text-2xl font-bold mb-6">Minhas Avaliações</h2>

                {reviews.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">Você ainda não fez nenhuma avaliação.</p>
                        <Link to="/add-review" className="btn-primary">
                            Criar Primeira Avaliação
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {reviews.map(review => (
                            <div key={review._id} className="border-l-4 border-blue-500 pl-6 py-4 bg-gray-50 rounded-r-lg">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-semibold">{review.gameTitle}</h3>
                                    <div className="flex items-center space-x-2">
                                        <div className="flex items-center bg-blue-500 text-white px-2 py-1 rounded">
                                            <span className="font-bold">{review.rating}</span>/5
                                        </div>
                                        <button
                                            onClick={() => handleDeleteReview(review._id)}
                                            className="text-red-500 hover:text-red-700 text-sm"
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </div>

                                <p className="text-gray-700 mb-3">{review.reviewText}</p>

                                <p className="text-sm text-gray-500">
                                    Criado em {new Date(review.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Profile
