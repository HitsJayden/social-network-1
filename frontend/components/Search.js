import React, { Component } from "react";
import Fuse from "fuse.js";

import Link from "next/link";

import SearchDiv from "./styles/SearchStyle";

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      input: "",
    };

    this.fetchData = this.fetchData.bind(this);
  }

  fetchData = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/users`,
        {
          method: "GET",

          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      const resData = await res.json();
      this.setState({ users: resData.users });
    } catch (err) {
      console.log(err);
    }
  };

  handleInput = (e) => {
    this.setState({ input: e.target.value });
  };

  componentDidMount() {
    this.fetchData();
  }

  render() {
    // here I handle the search bar with fuse
    const fuse = new Fuse(this.state.users, {
      keys: ["name", "surname", "nickname"],
    });

    // here we tell fuse to search the input of the user
    const results = fuse.search(this.state.input);

    // mapping results
    const usersResults = results.map((result) => {
      return (
        // default result is item
        <li key={result.item._id}>
          <Link href={`/auth/load-profile/${result.item._id}`}>
            {result.item.name + " " + result.item.surname + " " + result.item.nickname}
          </Link>
        </li>
      );
    });

    return (
      <SearchDiv>
        <input
          onChange={this.handleInput}
          type="text"
          placeholder="Search For An User"
          value={this.state.input}
        />

        <ul>{usersResults}</ul>
      </SearchDiv>
    );
  }
}

export default Search;