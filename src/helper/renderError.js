export default function renderError(response) {
    if (response.status === false) {
        if (response.hasOwnProperty("errors")) {
            return (<div className="alert alert-danger" role="alert">
            {response.errors.map((error, index) => (
                <li key={index} style={{ color: "red" }}>{error}</li>
            ))}
        </div>)
        }
        else if(response.hasOwnProperty("error")){
            return (
                <div className="alert alert-danger" role="alert">
                     <li key={1} style={{ color: "red" }}>{response.error}</li>
                </div>
            )
        }
    } else if (response.status === true) {
        return (<div className="alert alert-success" role="alert">
            <li style={{ color: "success" }}>{response.message}</li></div>)
    }
}