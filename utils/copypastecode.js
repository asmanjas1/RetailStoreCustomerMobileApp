<Stack.Screen
                name="Profile"
                options={{ headerShown: false }}
                children={(props) => <ProtectedRoute component={ProfileScreen} {...props} />}
                />
                <Stack.Screen
                name="Location"
                options={{ headerShown: false }}
                children={(props) => <ProtectedRoute component={LocationSelector} {...props} />}
                />