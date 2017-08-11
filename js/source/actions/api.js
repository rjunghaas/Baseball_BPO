import fetch from 'isomorphic-fetch'

// Helper  function for GET request to get list of players in database from server
export const getApi = url => {
	return fetch(url)
		.then((res) => res.json())
		.catch((err) => console.log(err))
}

// Helper function for posting inputted data to server to get BPO
export const postApi = (url, method, obj) => {
	var str = JSON.stringify(obj);
	return fetch(url, 
		{ 
			method: method,
      		headers: {
        		'Accept': 'application/json',
        		'Content-Type': 'application/json'
      		},
      		body: str
      	})
		.then((res) => res.json())
		.catch((err) => console.log(err))
}