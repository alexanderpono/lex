CC=g++
CFLAGS=-c -Wall
EXECUTABLE=lex
SRC_DIR = src
BIN_DIR = bin
SOURCES=$(SRC_DIR)/main.cpp $(SRC_DIR)/AppStateManager.cpp $(SRC_DIR)/AppControllerBuilder.cpp $(SRC_DIR)/SyntaxAnalyzer.cpp $(SRC_DIR)/SyntaxAnalyzeState.cpp $(SRC_DIR)/LexAnalyzer.cpp $(SRC_DIR)/AppController.cpp $(SRC_DIR)/AppState.cpp
OBJECTS=$(BIN_DIR)/main.o $(BIN_DIR)/AppStateManager.o $(BIN_DIR)/AppControllerBuilder.o $(BIN_DIR)/SyntaxAnalyzer.o $(BIN_DIR)/SyntaxAnalyzeState.o $(BIN_DIR)/LexAnalyzer.o $(BIN_DIR)/AppController.o $(BIN_DIR)/AppState.o

all: $(EXECUTABLE)

$(EXECUTABLE): $(OBJECTS)
	$(CC) $(OBJECTS) -o $(EXECUTABLE)

$(BIN_DIR)/%.o: $(SRC_DIR)/%.cpp
	$(CC) $(CFLAGS) $< -o $@

clean:
	del $(BIN_DIR)\*.o $(EXECUTABLE).exe
