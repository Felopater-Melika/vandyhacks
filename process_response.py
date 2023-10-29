from langchain.memory.chat_message_histories import SQLChatMessageHistory
from langchain.agents import ZeroShotAgent, Tool, AgentExecutor
from langchain.memory import ConversationBufferMemory
from langchain.memory.chat_memory import ChatMessageHistory
from langchain.memory.chat_message_histories import RedisChatMessageHistory
from langchain.llms import OpenAI
from langchain.chains import ConversationChain, LLMChain
from langchain.utilities import GoogleSearchAPIWrapper
from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferWindowMemory

def process_response(human_input):
    chat_message_history = SQLChatMessageHistory(
        session_id='test_session',
        connection_string='sqlite:///sqlite.db'
    )

    memory = ConversationBufferMemory(
        memory_key="chat_history", chat_memory=chat_message_history
    )

    template = """
    {chat_history}
    Human: {human_input}
    Assistant:"""

    prompt = PromptTemplate(input_variables=["human_input"], template=template)


    chatgpt_chain = LLMChain(
        llm=OpenAI(temperature=0, openai_api_key="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"),
        prompt=prompt,
        verbose=True,
        memory=memory, # ConversationBufferWindowMemory(k=10)
    )

    # print(chat_message_history.messages)

    output = chatgpt_chain.predict(human_input=human_input)
    # print(output)
    return output

# Example run: 
user_input = "What is your name."
result = process_response(user_input)
print(result)