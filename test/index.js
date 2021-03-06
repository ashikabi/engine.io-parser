const {
  encodePacket,
  encodePayload,
  decodePacket,
  decodePayload
} = require("..");
const expect = require("expect.js");

describe("engine.io-parser", () => {
  describe("single packet", () => {
    it("should encode/decode a string", done => {
      const packet = { type: "message", data: "test" };
      encodePacket(packet, {}, encodedPacket => {
        expect(encodedPacket).to.eql("4test");
        expect(decodePacket(encodedPacket)).to.eql(packet);
        done();
      });
    });

    it("should fail to decode a malformed packet", () => {
      expect(decodePacket("", {})).to.eql({
        type: "error",
        data: "parser error"
      });
      expect(decodePacket("a123", {})).to.eql({
        type: "error",
        data: "parser error"
      });
    });
  });

  describe("payload", () => {
    it("should encode/decode all packet types", done => {
      const packets = [
        { type: "open" },
        { type: "close" },
        { type: "ping", data: "probe" },
        { type: "pong", data: "probe" },
        { type: "message", data: "test" }
      ];
      encodePayload(packets, payload => {
        expect(payload).to.eql("0\x1e1\x1e2probe\x1e3probe\x1e4test");
        expect(decodePayload(payload)).to.eql(packets);
        done();
      });
    });

    it("should fail to decode a malformed payload", () => {
      expect(decodePayload("{")).to.eql([
        { type: "error", data: "parser error" }
      ]);
      expect(decodePayload("{}")).to.eql([
        { type: "error", data: "parser error" }
      ]);
      expect(decodePayload('["a123", "a456"]')).to.eql([
        { type: "error", data: "parser error" }
      ]);
    });
  });
});

if (typeof window !== "undefined") {
  require("./browser");
} else {
  require("./node");
}
