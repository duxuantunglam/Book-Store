import { useCurrentApp } from "components/context/app.context";

const AppHeader = () => {
    const { user } = useCurrentApp();
    return (
        <div>
            <h1>My App</h1>
            <div>
                {JSON.stringify(user)}
            </div>
        </div>
    )
}

export default AppHeader