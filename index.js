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
  }

  console.log("\nPilih atribut yang ingin diedit:");
  console.log("1. Judul");
  console.log("2. Genre");
  console.log("3. Penulis");
  console.log("4. Tahun Rilis");
  const choice = await askQuestion("Masukkan nomor: ");
  
  if (choice === "1") {
    song.judul = await askQuestion("Masukkan judul baru: ");
  } else if (choice === "2") {
    song.genre = await askQuestion("Masukkan genre baru: ");
  } else if (choice === "3") {
    song.penulis = await askQuestion("Masukkan penulis baru: ");
  } else if (choice === "4") {
    song.tahun = await askQuestion("Masukkan tahun rilis baru: ");
  } else {
    console.log("Pilihan tidak valid.");
    return;
  }
  
  saveData(data);
  console.log("Lagu berhasil diperbarui!");
}

async function deleteSong(singer) {
  let songs = listSongsBySinger(singer);
  if (songs.length === 0) return;
  
  const id = parseInt(await askQuestion("Masukkan ID lagu yang ingin dihapus: "));
  let data = readData();
  let newData = data.filter(song => !(song.id === id && song.penyanyi === singer));
  saveData(newData);
  console.log("Lagu berhasil dihapus!");
}

async function main() {
  if (isFirstRun) {
    console.log("\nHalo, selamat datang di database lagu!");
    isFirstRun = false;
  } else {
    console.log("\nSelamat kembali ke menu utama!");
  }

  while (true) {
    const singers = listSingers();
    if (singers.length === 0) {
      console.log("Tidak ada penyanyi dalam database.");
      console.log("1. Tambah penyanyi");
      console.log("2. Keluar");
      const choice = await askQuestion("Masukkan nomor: ");
      if (choice === "1") await addSinger();
      else if (choice === "2") process.exit();
      continue;
    }
    
    console.log("\n1. Pilih penyanyi");
    console.log("2. Tambah penyanyi");
    console.log("3. Keluar");
    const menuChoice = await askQuestion("Masukkan nomor: ");
    
    if (menuChoice === "1") {
      const singerIndex = parseInt(await askQuestion("Masukkan nomor penyanyi: ")) - 1;
      if (singerIndex >= 0 && singerIndex < singers.length) {
        const singer = singers[singerIndex];
        while (true) {
          console.log("\n1. Lihat daftar lagu");
          console.log("2. Tambah lagu");
          console.log("3. Edit lagu");
          console.log("4. Hapus lagu");
          console.log("5. Kembali ke menu utama");
          const choice = await askQuestion("Masukkan nomor: ");
          switch (choice) {
            case "1":
              await viewSongDetails(singer);
              break;
            case "2":
              await addSong(singer);
              break;
            case "3":
              await editSong(singer);
              break;
            case "4":
              await deleteSong(singer);
              break;
              case "5":
                return main();              
            default:
              console.log("Pilihan tidak valid.");
          }
        }
      } else {
        console.log("Pilihan tidak valid.");
      }
    } else if (menuChoice === "2") {
      await addSinger();
    } else if (menuChoice === "3") {
      console.log("\nTerima kasih telah menggunakan database lagu ini ^-^\n");
      rl.close();
      process.exit();
    } else {
      console.log("Pilihan tidak valid.");
    }
  }
}

function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

main();
