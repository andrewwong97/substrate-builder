#!/bin/bash

# Run the Azure CLI command and store the output in a variable
json_output=$(az storage account show-connection-string --resource-group sandbox --name wongandrew97)

# Use jq to extract the connectionString value from the JSON output
connection_string=$(echo $json_output | jq -r '.connectionString')

# Output the connectionString
echo $connection_string

