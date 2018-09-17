### Create an API that will be used by the front to have some fake data from the hardware. The api will have the following calls:

```
POST:
/createAccount
params:
-account: the account address to create
response:
{
	"message": "Acount created correctly",
	"status": 200
}
```

```
GET:
/accountInfo
params:
account: the account to query
response:
{
	"consumedEnergy": "50",
	"surplusEnergy": "5"
}
```
