import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from './firebaseConfig';
import { useEffect, useState } from 'react';
import Home from '../home/Home';
import collage from './collage.jpg';

import GoogleButton from 'react-google-button'
import logo from './logo.png'

import { ToastContainer, toast } from 'react-toastify';

import './SignIn.css';
import '../reviews/Reviews.css';

const loginError = () => {
  toast.error("Error logging in, try using 'Sign in with Google'");
}

function SignIn() {
    const [value, setValue] = useState('');

    const handleClick = () => {
    signInWithPopup(auth, provider).then((data) => {
      setValue(data.user.email)
      localStorage.setItem("email", data.user.email)
    });
    };

    useEffect(() => {
      setValue(localStorage.getItem('email'));
    })

    return (
      <>
      <ToastContainer />
      <div className="background-container">
        <div className="gradient-overlay"></div>
      </div>
      <div className="content-container">
      {/* <button onClick={handleClick}>Sign in with Google</button> */}
        <section className="form-02-main">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="_lk_de">
                  <div className="form-03-main">
                    <div className="logo">
                      <div style={{ fontWeight: '700', fontSize: 'larger' }}>welcome to</div>
                      <img src= {logo} style={{ width: '70%' }}/>
                    </div>
                    <div className="form-group">
                      <input type="email" name="email" className="form-control _ge_de_ol" placeholder="Enter Email" required="" aria-required="true" />
                    </div>

                    <div className="form-group">
                      <input type="password" name="password" className="form-control _ge_de_ol" placeholder="Enter Password" required="" aria-required="true" />
                    </div>

                    <div className="checkbox form-group">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="" id="" />
                        <label className="form-check-label" htmlFor="">
                          Remember me
                        </label>
                      </div>
                    </div>

                    <div className="form-group">
                      <button className="_btn_04" onClick={loginError}>
                        <>Login</>
                      </button>
                    </div>

                    <div className="form-group nm_lk"><p>Or</p></div>

                    <div className="form-group pt-0">
                      <GoogleButton onClick={handleClick}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      </>

    );
}

export default SignIn;