import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

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
    const fileInputRef = useRef(null)

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Para desenvolvimento, usar dados mockados
                const mockUser = {
                    _id: '1',
                    username: 'usuarioteste',
                    email: 'teste@exemplo.com',
                    createdAt: new Date().toISOString(),
                    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=GameController'
                }

                const mockReviews = [
                    {
                        _id: '1',
                        gameTitle: 'The Legend of Zelda: Breath of the Wild',
                        rating: 5,
                        reviewText: 'Um dos melhores jogos já criados. Mundo aberto incrível!',
                        createdAt: new Date(Date.now() - 86400000).toISOString() // 1 dia atrás
                    },
                    {
                        _id: '2',
                        gameTitle: 'Elden Ring',
                        rating: 4,
                        reviewText: 'Difícil mas recompensador. Gráficos espetaculares.',
                        createdAt: new Date(Date.now() - 172800000).toISOString() // 2 dias atrás
                    },
                    {
                        _id: '3',
                        gameTitle: 'Cyberpunk 2077',
                        rating: 3,
                        reviewText: 'Melhorou muito desde o lançamento. História incrível!',
                        createdAt: new Date(Date.now() - 259200000).toISOString() // 3 dias atrás
                    }
                ]

                setUser(mockUser)
                setReviews(mockReviews)

                // Calcular estatísticas
                const totalReviews = mockReviews.length
                const averageRating = mockReviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews

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
            setReviews(reviews.filter(review => review._id !== reviewId))
            alert('Avaliação excluída com sucesso!')
        } catch (err) {
            setError('Erro ao excluir avaliação')
            console.error('Erro ao excluir avaliação:', err)
        }
    }

    // Função para abrir o seletor de arquivos ao clicar na imagem
    const handleAvatarClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = null // Limpa seleção anterior
            fileInputRef.current.click()
        }
    }

    // Função para lidar com upload e atualizar avatar localmente (mock)
    const handleAvatarChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setUser(prev => ({
                    ...prev,
                    avatar: reader.result // Mostra preview local (base64)
                }))
                // Aqui você pode enviar o arquivo para o backend se desejar
            }
            reader.readAsDataURL(file)
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
                    <div className="flex items-center gap-2">
                        {user?.avatar && (
                            <div
                                className="relative group cursor-pointer"
                                style={{ width: 86, height: 86 }}
                                onClick={handleAvatarClick}
                                title="Clique para alterar a foto de perfil"
                            >
                                <img
                                    src={user.avatar}
                                    alt="Avatar"
                                    style={{ width: 86, height: 86 }}
                                    className="rounded-full object-cover border transition duration-200"
                                />
                                {/* Camada escura no hover */}
                                <span
                                    className="absolute inset-0 rounded-full bg-black opacity-0 group-hover:opacity-80 transition duration-200"
                                    style={{ pointerEvents: 'none' }}
                                />
                                {/* Texto "Alterar" */}
                                <span
                                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200"
                                    style={{ pointerEvents: 'none' }}
                                >
                                    <span className="text-white font-bold text-lg select-none">Alterar</span>
                                </span>
                                {/* Input de arquivo invisível */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleAvatarChange}
                                />
                            </div>
                        )}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">{user?.username}</h1>
                            <p className="text-gray-600">{user?.email}</p>
                            <p className="text-sm text-gray-500">
                                Membro desde {new Date(user?.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <Link
                            to="/add-review"
                            className=" hover:text-gray-600 transition-colors"
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