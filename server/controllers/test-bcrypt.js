import bcrypt from "bcrypt";

const enteredPassword = "12345678"; // Password entered during login
const storedHash = "$2b$10$VJTaZFWdTZ6WlAW6J0yaOOdxOjPez35jYZEYK4fUne595C/jQv2Fa"; // Copy from database

bcrypt.compare(enteredPassword, storedHash, (err, isMatch) => {
    if (err) console.error(err);
    console.log("✅ Password Match:", isMatch);
});
