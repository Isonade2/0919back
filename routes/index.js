const express = require("express");
const cors = require("cors");
const db = require("../config/db");
const app = express();
const PORT = 8000;
const bcrypt = require("bcryptjs");

app.use(express.json());
app.use(cors());
app.listen(PORT, () => {
  console.log("Server is running");
});
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const emailPattern = /^[A-Za-z0-9]+@[A-Za-z0-9]+\.[A-Za-z]+$/;

  if (!email || !password)
    //이메일 또는 비밀번호가 비어 있을 경우
    return res.status(400).send("이메일과 비밀번호 모두 입력해주세요.");

  if (!emailPattern.test(email))
    //이메일 정규식 확인
    return res.status(400).send("이메일을 형식에 맞춰 다시 입력해주세요.");

  if (password.length < 8)
    //패스워드가 8자리 미만 경우
    return res.status(400).send("비밀번호를 8자리 이상으로 입력해주세요.");

  const hashPassword = await bcrypt.hash(password, 10);
  console.log(hashPassword);
  try {
    const [results] = await db.query(
      "INSERT INTO pjy_users (email, password) VALUES (?, ?)",
      [email, hashPassword]
    );
    res.status(200).send("회원가입이 완료되었습니다.");
  } catch (error) {
    res.status(500).send("db 오류");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    //이메일 또는 비밀번호가 비어 있을 경우
    return res.status(400).send("이메일과 비밀번호 모두 입력해주세요.");

  try {
    const [results] = await db.query(
      "SELECT * FROM pjy_users WHERE email = ?",
      [email]
    );
    const storedHash = results[0].password; //디비 결과의 암호화 된 패스워드를 저장

    //유저로부터 받은 패스워드와 디비에 저장된 암호화된 패스워드가 일치하는지 확인
    bcrypt.compare(password, storedHash, (err, isMatch) => {
      if (err) {
        res.status(500).send("비밀번호 비교 오류");
      }
      if (isMatch) res.status(200).send("로그인이 완료되었습니다.");
      else res.status(200).send("아이디 또는 패스워드가 틀렸습니다.");
    });
  } catch (error) {
    res.status(500).send("db 오류");
  }
});
