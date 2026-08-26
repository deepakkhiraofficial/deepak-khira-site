// hashPassword.js
import bcrypt from "bcryptjs";

async function generateAdminPassword() {
  const plainPassword = "admin123"; // your desired password
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  console.log("Hashed password:", hashedPassword);
}

generateAdminPassword();
