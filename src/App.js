import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handlerShowAddFriend() {
    setShowAddFriend(!showAddFriend);
  }

  function handlerNewFriend(friend) {
    setFriends((friends) => [...friends, friend]);
  }

  function handleSelection(friend) {
    setSelectedFriend(friend);
    if (friend === null) {
      setShowAddFriend(true);
    } else {
      setShowAddFriend(false);
    }
  }

  function handleSplitBill(balance) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + balance }
          : friend
      )
    );

    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelectButton={handleSelection}
          selectedFriend={selectedFriend}
        />
        {showAddFriend && (
          <FormAddFriend
            onAddFriend={handlerNewFriend}
            setShowAddFriend={handlerShowAddFriend}
          />
        )}
        {!showAddFriend && (
          <Button onClick={handlerShowAddFriend}>Add Friend</Button>
        )}
        {showAddFriend && <Button onClick={handlerShowAddFriend}>Close</Button>}
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          handleSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelectButton, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelectButton={onSelectButton}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelectButton, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend?.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.round(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.round(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      {isSelected ? (
        <Button onClick={() => onSelectButton(null)}>Close</Button>
      ) : (
        <Button onClick={() => onSelectButton(friend)}>Select</Button>
      )}
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddFriend({ onAddFriend, setShowAddFriend }) {
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  const [name, setName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);

    setImage("https://i.pravatar.cc/48");
    setName("");
    setShowAddFriend();
  }

  return (
    <div>
      <form className="form-add-friend" onSubmit={handleSubmit}>
        <label> Friend Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label> Image Link</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <Button>Add</Button>
      </form>
    </div>
  );
}

function FormSplitBill({ selectedFriend, handleSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? Math.abs(bill - paidByUser) : null;
  const [whoIsPaying, setWhoIsPaying] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;

    handleSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2> Split Bill with {selectedFriend.name}</h2>
      <label>Bill Value</label>
      <input
        type="number"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>Your Expense</label>
      <input
        type="number"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />

      <label>{selectedFriend.name} Expense</label>
      <input type="number" disabled value={paidByFriend} />

      <label>Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value={selectedFriend.name}>{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}
