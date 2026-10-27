// =========================================================
// MOTOR DE HABITACIONES Y NAVEGACIÓN DEL MUNDO (js/rooms.js)
// =========================================================

const W = 480, H = 270;
const TILE = 16;
const COLS = 30, ROWS = 17;

// Diccionario maestro de habitaciones de Véspera
const ROOM_DEFS = {};

// Abre físicamente una puerta superior en la fila 7
function openUpperDoor(roomId, side) {
  const room = ROOM_DEFS[roomId];
  if (!room || !room.map || !room.map[7]) return;
  const row = room.map[7];
  const index = side === 'left' ? 0 : row.length - 1;
  room.map[7] = `${row.slice(0, index)}${side === 'left' ? '<' : '>'}${row.slice(index + 1)}`;
}

// Abre físicamente una puerta a nivel del suelo en las filas 13 y 14
function openGroundDoor(roomId, side) {
  const room = ROOM_DEFS[roomId];
  if (!room || !room.map) return;
  const column = side === 'left' ? 0 : COLS - 1;
  const symbol = side === 'left' ? '<' : '>';
  for (const rowIndex of [13, 14]) {
    const row = room.map[rowIndex];
    if (row) {
      room.map[rowIndex] = `${row.slice(0, column)}${symbol}${row.slice(column + 1)}`;
    }
  }
}

// Clasificación de biomas para fondos y paletas de color
function getRoomZone(roomId) {
  const id = Number(roomId);
  if ((id >= 201 && id <= 224) || id === 601 || (id >= 41 && id <= 45) || [9, 11, 12, 18, 19, 20, 28].includes(id)) return 'juramento';
  if ((id >= 401 && id <= 424) || id === 602 || (id >= 46 && id <= 50) || [15, 16, 24, 25, 26, 30].includes(id)) return 'reloj';
  if ((id >= 501 && id <= 524) || id === 603 || (id >= 51 && id <= 55) || [10, 13, 14, 21, 22, 23, 29].includes(id)) return 'astral';
  if (id === 604) return 'carmesi';
  return 'carmesi';
}

function getRoomDisplayLabel(roomId) {
  const room = ROOM_DEFS[roomId];
  return room ? (room.mapLabel || room.name) : 'Sala desconocida';
}

function getRoomMapLabel(roomId) {
  const room = ROOM_DEFS[roomId];
  return room ? (room.mapShortLabel || getRoomDisplayLabel(roomId)) : '?';
}
