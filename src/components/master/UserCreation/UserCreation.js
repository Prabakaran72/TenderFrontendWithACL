
const UserCreation = () => {
    return (
        <div className="card-body">
            <form>
                <div className="row align-items-center">
                    <div className="inputgroup col-lg-5 mb-4">
                        <div className="row align-items-center">
                        <div className="col-lg-4 text-dark font-weight-bold">
                            <label htmlFor="nitDate">
                            NIT Date<span className="text-danger">&nbsp;*</span>
                            </label>
                        </div>
                        <div className="col-lg-8">
                            <input
                            type="date"
                            className="form-control"
                            id="nitDate"
                            name="nitDate"
                            value={input.nitDate}
                            onChange={inputHandler}
                            />
                            {inputValidation.nitDate && (
                            <div className="pt-1">
                                <span className="text-danger font-weight-bold">
                                Select Valid Date..!
                                </span>
                            </div>
                            )}
                        </div>
                        </div>
                    </div> 
                </div>
            </form>
        </div>
    )
}

export default UserCreation