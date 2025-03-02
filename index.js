const fs = require("fs");
const readline = require("node:readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const FILE_PATH = "songs.json";
let isFirstRun = true;

function readData() {
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, "[]");
  }
  const file = fs.readFileSync(FILE_PATH);
  return JSON.parse(file);
}

function saveData(data) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
}

function listSingers() {
  const data = readData();
  const singers = [...new Set(data.map(song => song.penyanyi))];
  console.log("\nPenyanyi yang tersedia:");
  if (singers.length === 0) {
    console.log("(Kosong)");
  } else {
    singers.forEach((singer, index) => {
      console.log(`${index + 1}. ${singer}`);
    });
  }
  return singers;
}

async function addSinger() {
  const singer = await askQuestion("Masukkan nama penyanyi baru: ");
  const data = readData();
  if (!data.some(song => song.penyanyi === singer)) {
    saveData([...data, { penyanyi: singer }]);
    console.log("Penyanyi berhasil ditambahkan!");
  } else {
    console.log("Penyanyi sudah ada dalam database.");
  }
}

function listSongsBySinger(singer) {
  const data = readData().filter(song => song.penyanyi === singer && song.judul);
  console.log(`\nDaftar Lagu oleh ${singer}:`);
  if (data.length === 0) {
    console.log("Lagu penyanyi ini belum terdaftar :(");
    return [];
  }
  data.forEach(song => {
    console.log(`${song.id}. ${song.judul} (${song.tahun})`);
  });
  return data;
}

async function viewSongDetails(singer) {
  let songs = listSongsBySinger(singer);
  if (songs.length === 0) return;

  while (true) {
    const id = parseInt(await askQuestion("Masukkan ID lagu yang ingin diperiksa: "));
    const data = readData();
    const song = data.find(song => song.id === id && song.penyanyi === singer);
    
    if (song) {
      console.log("\nDetail Lagu:");
      console.log(`Judul: ${song.judul}`);
      console.log(`Genre: ${song.genre}`);
      console.log(`Penulis: ${song.penulis}`);
      console.log(`Penyanyi: ${song.penyanyi}`);
      console.log(`Tahun Rilis: ${song.tahun}`);
      
      const kembali = await askQuestion("Mau melihat detail lagu lain? (y/n): ");
      if (kembali.toLowerCase() !== "y") return;
    } else {
      console.log("Lagu tidak ditemukan.");
    }
  }
}

async function addSong(singer) {
  const judul = await askQuestion("Masukkan judul lagu: ");
  const genre = await askQuestion("Masukkan genre lagu: ");
  const penulis = await askQuestion("Masukkan penulis lagu: ");
  const tahun = await askQuestion("Masukkan tahun rilis: ");
  const data = readData();
  const singerSongs = data.filter(song => song.penyanyi === singer && song.judul);
  const id = singerSongs.length > 0 ? Math.max(...singerSongs.map(song => song.id)) + 1 : 1;
  data.push({ id, penyanyi: singer, judul, genre, penulis, tahun });
  saveData(data);
  console.log("Lagu berhasil ditambahkan!");
}

async function editSong(singer) {
  let songs = listSongsBySinger(singer);
  if (songs.length === 0) return;
  
  const id = parseInt(await askQuestion("Masukkan ID lagu yang ingin diedit: "));
  let data = readData();
  let song = data.find(song => song.id === id && song.penyanyi === singer);
  
  if (!song) {
    console.log("Lagu tidak ditemukan.");
    return;
  }}