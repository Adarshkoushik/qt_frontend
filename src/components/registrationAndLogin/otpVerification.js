import { useState } from "react"
import axios from "axios"
import '../../style.css'
import { useNavigate } from "react-router-dom"
import { Container, Row, Col, Card } from 'react-bootstrap';


export default function OtpVerification(){
    const [otp, setOtp] = useState('')
    const [errors, setErrors] = useState({})
    const [serverErrors, setServerErrors] = useState({})
    const navigate = useNavigate()

    const errorsObj = {}


    const validate = () => {
        if (!otp) {
            errorsObj.otpError = 'otp field is required'
        } else if (otp.length !== 6) {
            errorsObj.otpError = 'otp field must have 6 digits only'
        }
    }

    const handleOtpResend = async () => {
        const emailData = {
            email: localStorage.getItem('email')
        }
        try {
            const response = await axios.post("http://localhost:3100/api/users/reverifyEmail", emailData)
            console.log(response.data)
            alert(response.data)
        } catch (err) {
            console.log(err)
            setServerErrors(err.response.data)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = {
            email: localStorage.getItem('email'),
            otp: otp
        }
        validate()
        if (Object.keys(errorsObj).length === 0) {
            try {
                const response = await axios.post("http://localhost:3100/api/users/verifyEmail", formData)
                alert(response.data)
                navigate("/")
            } catch (err) {
                console.log(err)
                setServerErrors(err.response.data)
            }
        } else {
            setErrors(errorsObj)
        }
    }
    return (
        <>
            <Container fluid>
                <Row>
                    <Col xs={12} md={6} className='m-auto'>
                        <Card style={{ width: '30rem' }} className='m-auto p-3' border="primary">
                            <Card.Body>

                                <Card.Title > OTP Verification </Card.Title> <hr />
                                {
                                    serverErrors.length > 0 && <div>
                                        {serverErrors.map((ele, i) => {
                                            return <div key={i} className='error-message'>**{ele.msg}</div>
                                        })}
                                    </div>
                                }
                                <form onSubmit={handleSubmit}>
                                    <label className="form-label" htmlFor="otp">Enter Otp : </label>
                                    <input type="text"
                                        className="form-control"
                                        value={otp}
                                        id="otp"
                                        onChange={(e) => setOtp(e.target.value)}
                                    /><br />
                                    <a href=" " onClick={handleOtpResend}>Resend-Otp</a> <br />
                                    {
                                        errors.otpError && <div>{errors.otpError}</div>
                                    }
                                    {
                                        serverErrors.error && <div>{serverErrors.error}</div>
                                    } <br />
                                    <input type="submit" value='Verify' className="btn btn-primary" />
                                </form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
