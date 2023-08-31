export class GitHubUser {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`;

    return fetch(endpoint)
      .then((data) => data.json())
      .then((json) => {
        const { login, name, public_repos, followers } = json;

        return { login, name, public_repos, followers };
      });
  }
}
