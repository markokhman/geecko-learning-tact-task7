import "@stdlib/deploy";
message Secret {
    count: Int as uint32;
}

contract GameTask7 with Deployable {
    owner: Address;
    balance: Int as uint32;
    init(owner: Address){
        self.owner = owner;
        self.balance = 100;
    }

     fun mult(m: Int) {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Invalid sender");
        self.balance = self.balance * m;
    }

    receive(msg: Secret){
        self.mult(msg.count);
    }

    get fun balance(): Int {
        return self.balance;
    }
}