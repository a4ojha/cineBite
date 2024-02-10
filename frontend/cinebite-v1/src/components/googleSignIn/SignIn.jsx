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
        <section class="form-02-main">
          <div class="container">
            <div class="row">
              <div class="col-md-12">
                <div class="_lk_de">
                  <div class="form-03-main">
                    <div class="logo">
                      <div style={{ fontWeight: '700', fontSize: 'larger' }}>welcome to</div>
                      <img src= {logo} style={{ width: '70%' }}/>
                    </div>
                    <div class="form-group">
                      <input type="email" name="email" class="form-control _ge_de_ol" placeholder="Enter Email" required="" aria-required="true" />
                    </div>

                    <div class="form-group">
                      <input type="password" name="password" class="form-control _ge_de_ol" placeholder="Enter Password" required="" aria-required="true" />
                    </div>

                    <div class="checkbox form-group">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="" />
                        <label class="form-check-label" for="">
                          Remember me
                        </label>
                      </div>
                    </div>

                    <div class="form-group">
                      <button class="_btn_04" onClick={loginError}>
                        <>Login</>
                      </button>
                    </div>

                    <div class="form-group nm_lk"><p>Or...</p></div>

                    <div class="form-group pt-0">
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