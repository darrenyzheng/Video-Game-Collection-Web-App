import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const Collection = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('access');
        if (token === null) {
            navigate("/login");
            return;
        };
        fetch('http://localhost:5000/collection', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch');
                }
                return response.json();
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
    }, [navigate]); // Empty dependency array means this effect runs once on mount
    return (
        <h1> Collection </h1>
    )
}

export default Collection;
