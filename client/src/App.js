import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import Auth from './components/Auth';
import ListHeader from './components/ListHeader';
import ListItem from './components/ListItem';

function App() {
    const [cookies] = useCookies(null);

    const userEmail = cookies?.email;
    const auhtToken = cookies?.token;

    const [tasks, setTasks] = useState(null);

    const getData = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_SERVER_URL}/todos/${userEmail}`
            );
            const json = await response.json();
            setTasks(json);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (auhtToken) {
            getData();
        }
    }, [auhtToken]);

    const sortedTasks = tasks?.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    );

    return (
        <div className="App">
            {!auhtToken && <Auth />}
            {auhtToken && (
                <>
                    {' '}
                    <ListHeader
                        listName={'🏝️ TO - DO LIST'}
                        getData={getData}
                    />
                    <p className="user-email">Welcome back {userEmail}</p>
                    {sortedTasks?.map((task) => (
                        <ListItem key={task.id} task={task} getData={getData} />
                    ))}
                </>
            )}
        </div>
    );
}

export default App;
