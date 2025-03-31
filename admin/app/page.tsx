import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <div className={styles.loginHeader}>
                    <h1>Admin Portal</h1>
                </div>

                <div className={styles.loginContainer}>
                    <form className={styles.loginForm}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <button type="submit" className={styles.primary}>
                            Login
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
