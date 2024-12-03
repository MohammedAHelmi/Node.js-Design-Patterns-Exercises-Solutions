import styles from 'ansi-styles';

export default new Proxy(console, {
    get: (target, prop) => {
        if(!['red', 'green', 'yellow'].includes(prop))
            return target[prop];

        return (msg) => console.log(`${styles[prop].open}${msg}${styles[prop].close}`)
    }
});