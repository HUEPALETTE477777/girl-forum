import { useAuth } from "../context/AuthContext"

function errorHandler() {
    const { currentAuthError } = useAuth();

    let errorText;

    switch (currentAuthError) {
        case 401:
            errorText = "UNAUTHORIZED!"
            break;
    }

    if (currentAuthError && currentAuthError !== "NO TOKEN PROVIDED") {
        return <h2 className="text-red-900 text-center">{errorText} CODE: {currentAuthError}</h2>
    }
}


export default errorHandler;