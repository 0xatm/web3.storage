import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';

import GithubSVG from 'assets/icons/github';
import { useAppDispatch } from 'store';
import { getUserData, setAuthToken } from 'store/actions';

const Login = () => {
  // App wide methods
  const dispatch = useAppDispatch();
  const { push } = useRouter();

  // Error states
  const [errors, setErrors] = useState<{ email?: boolean }>({});

  // User form data binding
  const [{ email }, setFormData] = useState<{ email?: string }>({});

  // Callback for email login logic
  const authorizeAndNavigateToAccount = useCallback(
    async oauth => {
      // Setting auth token
      const {
        payload: { authentication },
      } = await dispatch(
        await setAuthToken(
          // TODO: Set to the actual auth from the api based off of email
          oauth
        )
      );

      // Getting user data
      await dispatch(await getUserData(authentication));

      // Redirecting to account page
      push('/account');
    },
    [dispatch, push]
  );

  // Callback for email login logic
  const onLoginWithEmail = useCallback(async () => {
    // Errors for empty fields
    if (!email) {
      setErrors({ email: !email });
      return false;
    }

    await authorizeAndNavigateToAccount(email);
  }, [email, authorizeAndNavigateToAccount]);

  // Callback for github login logic
  const onGithubLogin = useCallback(async () => {
    await authorizeAndNavigateToAccount('test:email');
  }, [authorizeAndNavigateToAccount]);

  return (
    <div className="login-container">
      <div className="login-content">
        <h3>Log in with</h3>
        <button onClick={onGithubLogin}>
          <div className="login-sub-container login-sub-container-github">
            <GithubSVG /> Github
          </div>
        </button>
        <h3 className="login-type-divider">or</h3>
        <div className="login-sub-container login-sub-container-email">
          <input
            className={clsx('login-email', errors.email && 'error')}
            placeholder="Enter your email"
            onChange={useCallback(e => setFormData(e.currentTarget.value), [])}
          />
          <input type="submit" value="Login" onClick={onLoginWithEmail} />
        </div>
      </div>
    </div>
  );
};

export default Login;
