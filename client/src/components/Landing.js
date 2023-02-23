import logoImg from "../assets/images/logo.png";

export default function HomeForm() {
  return (
    <>
      <div className='home-form d-flex justify-center align-center'>
        <div className='home-modal'>
          <h1
            className='d-flex align-center justify-center'
            style={{ gap: "3px", color: "rgb(66, 82, 110)" }}>
            <img src={logoImg} alt='' style={{ width: "35px" }} /> trackify
          </h1>
          <h2>Client</h2>
          <div className='btn-container d-flex' style={{ gap: "15px" }}>
            <button>Login</button>
            <button>Register</button>
          </div>
          <hr />
          <h2>Company</h2>
          <div className='btn-container d-flex' style={{ gap: "15px" }}>
            <button>Login</button>
            <button>Register</button>
          </div>
        </div>
      </div>
    </>
  );
}
