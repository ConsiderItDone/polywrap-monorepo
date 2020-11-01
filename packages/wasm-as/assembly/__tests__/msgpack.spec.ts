import {
  Decoder,
  Write,
  WriteEncoder,
  WriteSizer
} from "../msgpack";

class Sanity {
  nil: string | null = "null";
  int8: i8;
  int16: i16;
  int32: i32;
  int64: i64;
  uint8: u8;
  uint16: u16;
  uint32: u32;
  uint64: u64;
  float32: f32;
  float64: f64;
  str: string = "";
  bytes: ArrayBuffer = new ArrayBuffer(1);
  array: Array<u8> = new Array<u8>();
  map: Map<string, Array<i32>> = new Map<string, Array<i32>>();

  init(): void {
    this.nil = null;
    this.int8 = -128;
    this.int16 = -32768;
    this.int32 = -2147483648;
    this.int64 = -9223372036854775808;
    this.uint8= 255;
    this.uint16 = 65535;
    this.uint32 = 4294967295;
    this.uint64 = 18446744073709551615;
    this.float32 = 3.40282344818115234375;
    this.float64 = 3124124512.598273468017578125;
    this.str = "Hello, world!";
    this.bytes = new ArrayBuffer(12);
    this.array = [10, 20, 30];
    this.map = new Map<string, Array<i32>>();
    this.map.set("foo", [1, -1, 42]);
    this.map.set("baz", [12412, -98987]);
  }

  read(reader: Decoder): void {
    var numFields = reader.readMapSize();

    while (numFields > 0) {
      numFields--;
      const field = reader.readString();

      if (field == "nil") {
        expect(reader.isNextNil()).toBeTruthy();
        this.nil = null;
      } else if (field == "int8") {
        this.int8 = reader.readInt8();
      } else if (field == "int16") {
        this.int16 = reader.readInt16();
      } else if (field == "int32") {
        this.int32 = reader.readInt32();
      } else if (field == "int64") {
        this.int64 = reader.readInt64();
      } else if (field == "uint8") {
        this.uint8 = reader.readUInt8();
      } else if (field == "uint16") {
        this.uint16 = reader.readUInt16();
      } else if (field == "uint32") {
        this.uint32 = reader.readUInt32();
      } else if (field == "uint64") {
        this.uint64 = reader.readUInt64();
      } else if (field == "float32") {
        this.float32 = reader.readFloat32();
      } else if (field == "float64") {
        this.float64 = reader.readFloat64();
      } else if (field == "str") {
        this.str = reader.readString();
      } else if (field == "bytes") {
        this.bytes = reader.readByteArray();
      } else if (field == "array") {
        this.array = reader.readArray(
          (decoder: Decoder): u8 => {
            return decoder.readUInt8();
          }
        );
      } else if (field == "map") {
        this.map = reader.readMap(
          (decoder: Decoder): string => {
            return decoder.readString();
          },
          (decoder: Decoder): Array<i32> => {
            return decoder.readArray(
              (decoder: Decoder): i32 => {
                return decoder.readInt32();
              }
            );
          }
        );
      } else {
        throw new Error(
          "Sanity.decode: Unknown field name '" + field + "'"
        );
      }
    }
  }

  write(writer: Write): void {
    writer.writeMapSize(15);
    writer.writeString("nil");
    writer.writeNil();
    writer.writeString("int8");
    writer.writeInt8(this.int8);
    writer.writeString("int16");
    writer.writeInt16(this.int16);
    writer.writeString("int32");
    writer.writeInt32(this.int32);
    writer.writeString("int64");
    writer.writeInt64(this.int64);
    writer.writeString("uint8");
    writer.writeUInt8(this.uint8);
    writer.writeString("uint16");
    writer.writeUInt16(this.uint16);
    writer.writeString("uint32");
    writer.writeUInt32(this.uint32);
    writer.writeString("uint64");
    writer.writeUInt64(this.uint64);
    writer.writeString("float32");
    writer.writeFloat32(this.float32);
    writer.writeString("float64");
    writer.writeFloat64(this.float64);
    writer.writeString("str");
    writer.writeString(this.str);
    writer.writeString("bytes");
    writer.writeBytes(this.bytes);
    writer.writeString("array");
    writer.writeArray(this.array, (writer: Write, item: u8) => {
      writer.writeUInt8(item);
    });
    writer.writeString("map");
    writer.writeMap(
      this.map,
      (writer: Write, key: string): void => {
        writer.writeString(key);
      },
      (writer: Write, value: Array<i32>) => {
        writer.writeArray(value, (writer: Write, item: i32) => {
          writer.writeInt32(item);
        });
      }
    );
  }

  toBuffer(): ArrayBuffer {
    const sizer = new WriteSizer();
    this.write(sizer);
    const buffer = new ArrayBuffer(sizer.length);
    const encoder = new WriteEncoder(buffer);
    this.write(encoder);
    return buffer;
  }

  fromBuffer(buffer: ArrayBuffer): void {
    const decoder = new Decoder(buffer);
    this.read(decoder);
  }
}

describe("MsgPack: Sanity", () => {
  it("Serializes & Deserializes", () => {
    const input = new Sanity();
    input.init();
    const output = new Sanity();
    output.fromBuffer(input.toBuffer());
    expect(output).toStrictEqual(input);
  });
});